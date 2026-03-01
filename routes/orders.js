const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

// Get user orders
router.get("/user/:userId", orderController.getUserOrders);

// Get single order
router.get("/:id", orderController.getOrder);

// Create order
router.post("/", orderController.createOrder);

// Update order status (admin)
router.put("/:id/status", orderController.updateOrderStatus);

// Get all orders (admin)
router.get("/", orderController.getAllOrders);

module.exports = router;
