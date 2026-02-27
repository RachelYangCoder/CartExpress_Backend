const Review = require("../model/reviews");
const Product = require("../model/product_detail");
const Order = require("../model/orders");

// @route  POST /api/products/:productId/reviews
// @access Private
exports.createReview = async (req, res, next) => {
  try {
    const { rating, title, comment, images, orderId } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    // Verify user actually ordered this product
    const order = await Order.findOne({
      _id: orderId,
      userId,
      "items.productId": productId,
      paymentStatus: "paid",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased.",
      });
    }

    const review = await Review.create({
      productId,
      userId,
      orderId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: true,
    });

    // Recalculate product average rating
    const stats = await Review.aggregate([
      { $match: { productId: review.productId, isApproved: true } },
      { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].count,
      });
    }

    res.status(201).json({ success: true, data: { review } });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/products/:productId/reviews
// @access Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ productId: req.params.productId, isApproved: true })
        .populate("userId", "firstName lastName avatar")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Review.countDocuments({ productId: req.params.productId, isApproved: true }),
    ]);

    res.status(200).json({
      success: true,
      data: { reviews, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/reviews/:id/approve
// @access Private/Admin
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved !== false },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    res.status(200).json({ success: true, data: { review } });
  } catch (err) {
    next(err);
  }
};