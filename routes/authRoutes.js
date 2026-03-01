const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updatePassword,
  makeAdmin,    // Add this
  makeVendor    // Add this
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

// DEVELOPMENT ONLY - REMOVE IN PRODUCTION
router.post("/make-admin", makeAdmin);
router.post("/make-vendor", makeVendor);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update-password", protect, updatePassword);

module.exports = router;