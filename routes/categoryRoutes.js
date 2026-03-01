const express = require("express");
const router = express.Router();
const Category = require("../model/categories");
const { protect, authorize } = require("../middleware/auth");

// GET all categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort("sortOrder").lean();
    res.status(200).json({ success: true, data: { categories } });
  } catch (err) { next(err); }
});

// GET single category
router.get("/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });
    res.status(200).json({ success: true, data: { category } });
  } catch (err) { next(err); }
});

// Admin: create / update / delete
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: { category } });
  } catch (err) { next(err); }
});

router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });
    res.status(200).json({ success: true, data: { category } });
  } catch (err) { next(err); }
});

router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, message: "Category deactivated." });
  } catch (err) { next(err); }
});

module.exports = router;