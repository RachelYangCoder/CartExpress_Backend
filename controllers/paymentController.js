const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../model/orders");
const Payment = require("../model/payments");

// @route  POST /api/payments/create-intent
// @access Private
// Creates a Stripe PaymentIntent from cart items before an order exists.
// Payload: { items: [{ productId, quantity, variantId? }], tax?: number }
// Returns: { clientSecret, paymentId, amount }
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { items, tax = 0 } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided." });
    }

    // Resolve each item against the live product — never trust client-sent prices
    const Product = require("../model/product_detail");
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}.` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }

      let price = product.price;
      if (item.variantId) {
        const variant = product.variants.id(item.variantId);
        if (!variant) return res.status(400).json({ success: false, message: "Variant not found." });
        price = variant.price;
      }

      subtotal += price * item.quantity;
    }

    const taxAmount = typeof tax === "number" ? tax : 0;
    const total = Math.max(0, subtotal + taxAmount);
    const amountInCents = Math.round(total * 100);

    if (amountInCents < 50) {
      return res.status(400).json({ success: false, message: "Order total is too low to process." });
    }

    // Create the PaymentIntent — no orderId yet, order is created after payment succeeds
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: { userId: userId.toString() },
    });

    // Store a pending Payment record with no orderId — it gets linked when the order is created
    const payment = await Payment.create({
      orderId: null,
      userId,
      amount: total,
      currency: "usd",
      paymentMethod: "stripe",
      paymentGateway: "stripe",
      stripePaymentIntentId: paymentIntent.id,
      status: "pending",
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
        amount: total,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/payments/webhook
// @access Public (Stripe calls this)
// IMPORTANT: This route must use express.raw() body parser — see server.js
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object;

        // Mark the Payment record as completed.
        // The order is created by the frontend immediately after confirmCardPayment
        // resolves, so we just keep this record up to date as a safety net.
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: intent.id },
          {
            status: "completed",
            transactionId: intent.latest_charge,
            stripeChargeId: intent.latest_charge,
            paidAt: new Date(),
            paymentDetails: {
              cardLast4: intent.payment_method_details?.card?.last4,
              cardBrand: intent.payment_method_details?.card?.brand,
            },
          }
        );

        // If an orderId was already linked (e.g. order was created before webhook fired),
        // update its payment status too
        const linkedPayment = await Payment.findOne({ stripePaymentIntentId: intent.id });
        if (linkedPayment?.orderId) {
          await Order.findByIdAndUpdate(linkedPayment.orderId, {
            paymentStatus: "paid",
            status: "processing",
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: intent.id },
          {
            status: "failed",
            failureReason: intent.last_payment_error?.message,
          }
        );

        if (intent.metadata?.orderId) {
          await Order.findByIdAndUpdate(intent.metadata.orderId, { paymentStatus: "failed" });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        await Payment.findOneAndUpdate(
          { stripeChargeId: charge.id },
          {
            status: "refunded",
            refundAmount: charge.amount_refunded / 100,
            refundedAt: new Date(),
          }
        );
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Webhook handler failed." });
  }
};

// @route  POST /api/payments/verify-intent
// @access Private
// Accepts a stripePaymentIntentId and returns { success: true/false }
exports.verifyPaymentIntent = async (req, res, next) => {
  try {
    const { stripePaymentIntentId } = req.body;

    if (!stripePaymentIntentId) {
      return res.status(400).json({ success: false, message: "stripePaymentIntentId is required." });
    }

    // Confirm directly with Stripe — never trust client-reported status
    const intent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);

    // Also verify the payment record belongs to this user
    const payment = await Payment.findOne({
      stripePaymentIntentId,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(403).json({ success: false, message: "Payment not found or access denied." });
    }

    const succeeded = intent.status === "succeeded";
    res.status(200).json({ success: succeeded });
  } catch (err) {
    // Stripe throws if the intent ID doesn't exist
    if (err.type === "StripeInvalidRequestError") {
      return res.status(400).json({ success: false, message: "Invalid payment intent ID." });
    }
    next(err);
  }
};
exports.getPaymentByOrder = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found." });

    if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, data: { payment } });
  } catch (err) {
    next(err);
  }
};