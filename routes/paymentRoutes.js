const express = require("express");
const router = express.Router();
const {
  createPaymentIntent, stripeWebhook, getPaymentByOrder,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

// Stripe webhook — uses raw body (handled in server.js before JSON middleware)
router.post("/webhook", stripeWebhook);

router.post("/create-intent", protect, createPaymentIntent);
router.get("/:orderId", protect, getPaymentByOrder);

module.exports = router;
