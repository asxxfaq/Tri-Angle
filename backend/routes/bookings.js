const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getBookingById, updateBooking, getBookingStats } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getBookingStats);
router.get('/', protect, getBookings);
router.post('/', protect, createBooking);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);

module.exports = router;
