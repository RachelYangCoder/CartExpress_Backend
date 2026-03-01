const express = require("express");
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
} = require("../controllers/productController");
const { getProductReviews, createReview } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

// Reviews nested under products
router.get("/:productId/reviews", getProductReviews);
router.post("/:productId/reviews", protect, createReview);

module.exports = router;