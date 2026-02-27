const express = require("express");
const router = express.Router();
const {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart, mergeCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

// Optional auth — works for both guests and logged-in users
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return protect(req, res, next);
  }
  next();
};

router.get("/", optionalAuth, getCart);
router.post("/items", optionalAuth, addToCart);
router.put("/items/:itemId", optionalAuth, updateCartItem);
router.delete("/items/:itemId", optionalAuth, removeFromCart);
router.delete("/", optionalAuth, clearCart);
router.post("/merge", protect, mergeCart); // only for logged-in users

module.exports = router;