const express = require("express");
const router = express.Router();
const {
  createPaymentIntent, stripeWebhook, getPaymentByOrder, verifyPaymentIntent,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

// Stripe webhook — uses raw body (handled in server.js before JSON middleware)
router.post("/webhook", stripeWebhook);

router.post("/create-intent", protect, createPaymentIntent);
router.post("/verify-intent", protect, verifyPaymentIntent);
router.get("/:orderId", protect, getPaymentByOrder);

module.exports = router;