const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc  Register new customer
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, phone, address, otp } = req.body;
  try {
    if (!name || !email || !password || !phone || !otp) {
      return res.status(400).json({ message: 'Please fill all required fields and provide OTP' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const OTP = require('../models/OTP');
    const validOTP = await OTP.findOne({ email, otp });
    if (!validOTP) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const user = await User.create({ name, email, password, phone, address });
    await OTP.deleteMany({ email }); // Remove OTP after successful registration
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account suspended' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get logged-in user profile
// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Forgot password - Send OTP
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    const message = `Your TRI-ANGLE password reset OTP is ${otp}. It will expire in 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #c9a84c; border-radius: 10px;">
        <h2 style="color: #7b1c2e;">TRI-ANGLE Catering</h2>
        <p>You requested a password reset. Your OTP is:</p>
        <h1 style="color: #c9a84c; letter-spacing: 5px; text-align: center;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <hr style="border: 0.5px solid #eee;">
        <p style="font-size: 0.8rem; color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'TRI-ANGLE Password Reset OTP',
      message,
      html,
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Verify OTP
// @route POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Reset password
// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Send OTP for login
// @route POST /api/auth/login-otp
const sendLoginOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isActive) return res.status(403).json({ message: 'Account suspended' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.loginOTP = otp;
    user.loginOTPExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    const message = `Your TRI-ANGLE login OTP is ${otp}. It will expire in 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #c9a84c; border-radius: 10px;">
        <h2 style="color: #7b1c2e;">TRI-ANGLE Catering</h2>
        <p>Login to your account. Your OTP is:</p>
        <h1 style="color: #c9a84c; letter-spacing: 5px; text-align: center;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <hr style="border: 0.5px solid #eee;">
        <p style="font-size: 0.8rem; color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'TRI-ANGLE Login OTP',
      message,
      html,
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Verify Login OTP
// @route POST /api/auth/verify-login-otp
const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      email,
      loginOTP: otp,
      loginOTPExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(401).json({ message: 'Invalid or expired OTP' });
    if (!user.isActive) return res.status(403).json({ message: 'Account suspended' });

    user.loginOTP = undefined;
    user.loginOTPExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Send OTP for registration
// @route POST /api/auth/send-register-otp
const sendRegisterOTP = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const OTP = require('../models/OTP');
    
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: generatedOTP });

    const message = `Your TRI-ANGLE registration OTP is ${generatedOTP}. It will expire in 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #c9a84c; border-radius: 10px;">
        <h2 style="color: #7b1c2e;">TRI-ANGLE Catering</h2>
        <p>You requested to create an account. Your OTP is:</p>
        <h1 style="color: #c9a84c; letter-spacing: 5px; text-align: center;">${generatedOTP}</h1>
        <p>This code will expire in 10 minutes.</p>
        <hr style="border: 0.5px solid #eee;">
      </div>
    `;

    await sendEmail({
      email,
      subject: 'TRI-ANGLE Registration OTP',
      message,
      html,
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, forgotPassword, verifyOTP, resetPassword, sendLoginOTP, verifyLoginOTP, sendRegisterOTP };
