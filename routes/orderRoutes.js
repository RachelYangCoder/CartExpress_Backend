const express = require("express");
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

// Customer routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/cancel", protect, cancelOrder);

// Admin routes
router.get("/", protect, authorize("admin"), getAllOrders);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

module.exports = router;