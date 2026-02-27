const Product = require("../model/product_detail");

// @route  GET /api/products
// @access Public
exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort = "-createdAt", featured } = req.query;

    const filter = { isActive: true };
    if (category) filter.categoryId = category;
    if (featured) filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/products/:id
// @access Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name slug");
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/products
// @access Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/products/:id
// @access Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/products/:id
// @access Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false }, // soft delete
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.status(200).json({ success: true, message: "Product deactivated." });
  } catch (err) {
    next(err);
  }
};
