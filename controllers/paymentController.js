const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../model/orders");
const Payment = require("../model/payments");

// @route  POST /api/payments/create-intent
// @access Private
// Creates a Stripe PaymentIntent and returns the client_secret to the frontend
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "Order already paid." });
    }

    // Amount in cents
    const amountInCents = Math.round(order.total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        orderId: orderId.toString(),
        userId: req.user._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    // Create a pending Payment record
    const payment = await Payment.create({
      orderId,
      userId: req.user._id,
      amount: order.total,
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
        const { orderId } = intent.metadata;

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

        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "paid",
          status: "processing",
        });
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

// @route  GET /api/payments/:orderId
// @access Private
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