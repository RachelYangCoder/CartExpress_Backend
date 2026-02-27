const Order = require("../model/orders");
const Cart = require("../model/cart");
const Product = require("../model/product_detail");
const InventoryLog = require("../model/inventory");

// @route  POST /api/orders
// @access Private
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, billingAddress, paymentMethod, customerNotes, couponCode } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    // Verify stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}.`,
        });
      }
    }

    // Build order items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      sku: item.sku,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      tax: 0, // extend with real tax calc if needed
      subtotal: item.subtotal,
      total: item.subtotal,
    }));

    const order = await Order.create({
      userId,
      items: orderItems,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shippingCost: 0,
      discount: cart.discount,
      total: cart.total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      customerNotes,
      couponCode,
    });

    // Deduct stock and log inventory
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      const previousStock = product.stockQuantity;
      product.stockQuantity -= item.quantity;
      product.totalSales = (product.totalSales || 0) + item.quantity;
      await product.save();

      await InventoryLog.create({
        productId: item.productId,
        variantId: item.variantId,
        type: "sale",
        quantity: -item.quantity,
        previousStock,
        newStock: product.stockQuantity,
        orderId: order._id,
        performedBy: userId,
      });
    }

    // Clear cart
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders
// @access Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find({ userId: req.user._id })
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      data: { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders/:id
// @access Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("paymentId");
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    // Customers can only see their own orders; admins see all
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/orders/:id/cancel
// @access Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage." });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || "Customer request";
    await order.save();

    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/orders
// @access Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = status ? { status } : {};

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("userId", "email firstName lastName")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/orders/:id/status
// @access Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, carrier } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(trackingNumber && { trackingNumber }),
        ...(carrier && { carrier }),
        ...(status === "shipped" && { shippedAt: new Date() }),
        ...(status === "delivered" && { deliveredAt: new Date() }),
      },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};
