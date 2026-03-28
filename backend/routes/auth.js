const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, forgotPassword, verifyOTP, resetPassword, sendLoginOTP, verifyLoginOTP, sendRegisterOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

router.post('/login-otp', sendLoginOTP);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/send-register-otp', sendRegisterOTP);

module.exports = router;
