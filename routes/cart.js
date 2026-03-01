const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Get cart
router.get("/", cartController.getCart);

// Add to cart
router.post("/add", cartController.addToCart);

// Remove from cart
router.post("/remove", cartController.removeFromCart);

// Update cart item
router.post("/update", cartController.updateCartItem);

// Clear cart
router.post("/clear", cartController.clearCart);

module.exports = router;
