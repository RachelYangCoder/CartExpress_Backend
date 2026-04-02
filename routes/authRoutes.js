const express = require("express");
const router = express.Router();
const { 
  register, 
  login,
  checkLogin,
  getMe, 
  updatePassword,
  makeAdmin,    // Add this
  makeVendor    // Add this
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/check-login", checkLogin);

// DEVELOPMENT ONLY — blocked in production
if (process.env.NODE_ENV !== "production") {
  router.post("/make-admin", makeAdmin);
  router.post("/make-vendor", makeVendor);
}

// Protected routes
router.get("/me", protect, getMe);
router.put("/update-password", protect, updatePassword);

module.exports = router;