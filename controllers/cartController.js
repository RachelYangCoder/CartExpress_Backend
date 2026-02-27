const Cart = require("../model/cart");
const Product = require("../model/product_detail");

// Get cart
exports.getCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    
    const query = userId ? { userId } : { sessionId };
    let cart = await Cart.findOne(query).populate("items.productId");

    if (!cart) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, sessionId, productId, variantId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const query = userId ? { userId } : { sessionId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart(query);
    }

    const item = {
      productId,
      variantId,
      name: product.name,
      sku: product.sku,
      image: product.images?.[0],
      price: product.price,
      quantity: parseInt(quantity) || 1,
      subtotal: product.price * (parseInt(quantity) || 1),
    };

    // Check if item already exists
    const existingItem = cart.items.findIndex(
      (i) => i.productId.toString() === productId && i.variantId === variantId
    );

    if (existingItem > -1) {
      cart.items[existingItem].quantity += item.quantity;
      cart.items[existingItem].subtotal = 
        cart.items[existingItem].price * cart.items[existingItem].quantity;
    } else {
      cart.items.push(item);
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    cart.total = cart.subtotal + (cart.tax || 0) - (cart.discount || 0);

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, sessionId, productId } = req.body;
    
    const query = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    
    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    cart.total = cart.subtotal + (cart.tax || 0) - (cart.discount || 0);

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, sessionId, productId, quantity } = req.body;
    
    const query = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not in cart" });
    }

    item.quantity = parseInt(quantity);
    item.subtotal = item.price * item.quantity;

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    cart.total = cart.subtotal + (cart.tax || 0) - (cart.discount || 0);

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;
    
    const query = userId ? { userId } : { sessionId };
    await Cart.deleteOne(query);

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
