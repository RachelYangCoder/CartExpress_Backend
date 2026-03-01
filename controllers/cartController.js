const Cart = require("../model/cart");
const Product = require("../model/product_detail");
const { v4: uuidv4 } = require("uuid");

// Helper: get cart by user or session
const getCart = async (userId, sessionId) => {
  if (userId) return Cart.findOne({ userId });
  return Cart.findOne({ sessionId });
};

// @route  GET /api/cart
// @access Public (guest or logged-in)
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const sessionId = req.headers["x-session-id"] || null;

    const cart = await getCart(userId, sessionId);
    if (!cart) return res.status(200).json({ success: true, data: { cart: { items: [], total: 0 } } });

    res.status(200).json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/cart/items
// @access Public (guest or logged-in)
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    const userId = req.user?._id || null;
    let sessionId = req.headers["x-session-id"] || null;

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Determine price (from variant or base price)
    let price = product.price;
    let sku = product.sku;
    let image = product.thumbnail;
    if (variantId) {
      const variant = product.variants.id(variantId);
      if (!variant) return res.status(404).json({ success: false, message: "Variant not found." });
      price = variant.price;
      sku = variant.sku;
      image = variant.image || image;
    }

    let cart = await getCart(userId, sessionId);

    if (!cart) {
      // Generate a session ID for guest carts
      if (!userId && !sessionId) sessionId = uuidv4();
      cart = new Cart({
        userId,
        sessionId: userId ? null : sessionId,
        items: [],
        expiresAt: userId ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days for guests
      });
    }

    // Check if item already in cart
    const existingIdx = cart.items.findIndex(
      (i) => i.productId.toString() === productId && String(i.variantId) === String(variantId)
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
      cart.items[existingIdx].subtotal = cart.items[existingIdx].price * cart.items[existingIdx].quantity;
    } else {
      cart.items.push({
        productId,
        variantId: variantId || undefined,
        name: product.name,
        sku,
        image,
        price,
        quantity,
        subtotal: price * quantity,
      });
    }

    await cart.save();
    res.status(200).json({ success: true, data: { cart }, sessionId });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/cart/items/:itemId
// @access Public
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const userId = req.user?._id || null;
    const sessionId = req.headers["x-session-id"] || null;

    const cart = await getCart(userId, sessionId);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart." });

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
      item.subtotal = item.price * quantity;
    }

    await cart.save();
    res.status(200).json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/cart/items/:itemId
// @access Public
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const sessionId = req.headers["x-session-id"] || null;

    const cart = await getCart(userId, sessionId);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    res.status(200).json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/cart
// @access Public
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const sessionId = req.headers["x-session-id"] || null;

    await Cart.findOneAndDelete(userId ? { userId } : { sessionId });
    res.status(200).json({ success: true, message: "Cart cleared." });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/cart/merge
// @access Private — merges guest cart into user cart on login
exports.mergeCart = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user._id;

    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart) return res.status(200).json({ success: true, message: "No guest cart to merge." });

    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      guestCart.userId = userId;
      guestCart.sessionId = null;
      guestCart.expiresAt = null;
      await guestCart.save();
      return res.status(200).json({ success: true, data: { cart: guestCart } });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingIdx = userCart.items.findIndex(
        (i) => i.productId.toString() === guestItem.productId.toString()
      );
      if (existingIdx > -1) {
        userCart.items[existingIdx].quantity += guestItem.quantity;
        userCart.items[existingIdx].subtotal =
          userCart.items[existingIdx].price * userCart.items[existingIdx].quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    await userCart.save();
    await guestCart.deleteOne();
    res.status(200).json({ success: true, data: { cart: userCart } });
  } catch (err) {
    next(err);
  }
};
