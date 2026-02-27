const Order = require("../model/orders");
const Cart = require("../model/cart");

// Get orders for user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const { userId, sessionId, items, shippingAddress, paymentMethod, tax = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "Order must have items" });
    }

    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const total = subtotal + tax;

    const order = new Order({
      userId,
      sessionId,
      items,
      subtotal,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "confirmed",
    });

    await order.save();

    // Clear cart
    const cartQuery = userId ? { userId } : { sessionId };
    await Cart.deleteOne(cartQuery);

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    // TODO: Add admin authentication check
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    // TODO: Add admin authentication check
    const { status, limit = 50, page = 1 } = req.query;

    let query = {};
    if (status) query.orderStatus = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate("userId", "email firstName lastName")
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
