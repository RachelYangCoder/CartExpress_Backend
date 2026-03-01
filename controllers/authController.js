const jwt = require("jsonwebtoken");
const User = require("../model/user");

// Helper: sign JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// Helper: send token response
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined; // strip password from output
  res.status(statusCode).json({ success: true, token, data: { user } });
};

// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }
    const user = await User.create({ email, password, firstName, lastName, phone });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account has been deactivated." });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};

// @route  PUT /api/auth/update-password
// @access Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/make-admin
// @access Public (DEVELOPMENT ONLY - REMOVE IN PRODUCTION!)
// @desc   Temporarily promote a user to admin role for testing
exports.makeAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ 
      success: true, 
      message: `User ${email} is now an admin. Please login again to get updated token.`,
      data: { user } 
    });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/make-vendor
// @access Public (DEVELOPMENT ONLY - REMOVE IN PRODUCTION!)
// @desc   Temporarily promote a user to vendor role for testing
exports.makeVendor = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    
    const user = await User.findOneAndUpdate(
      { email },
      { role: "vendor" },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ 
      success: true, 
      message: `User ${email} is now a vendor. Please login again to get updated token.`,
      data: { user } 
    });
  } catch (err) {
    next(err);
  }
};