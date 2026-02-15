const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Get all products
router.get("/", productController.getProducts);

// Get single product
router.get("/:id", productController.getProduct);

// Create product (admin)
router.post("/", productController.createProduct);

// Update product (admin)
router.put("/:id", productController.updateProduct);

// Delete product (admin)
router.delete("/:id", productController.deleteProduct);

module.exports = router;
