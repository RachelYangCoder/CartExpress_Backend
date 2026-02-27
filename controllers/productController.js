const Product = require("../model/product_detail");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;
    
    let query = {};
    if (category) query.categoryId = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("categoryId");

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId");
    
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    // TODO: Add admin authentication check
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    // TODO: Add admin authentication check
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    // TODO: Add admin authentication check
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
