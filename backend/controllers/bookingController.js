const Booking = require('../models/Booking');
const Staff = require('../models/Staff');
const EventType = require('../models/EventType');
const { sendBookingSlipSMS, sendCustomerStatusEmail } = require('../utils/smsService');

// @desc Create a new booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const {
      eventType, eventName, eventDate, eventTime, venueName, venueAddress,
      city, maleStaff, femaleStaff, genderPreference, notes, specialRequirements,
      duration, contactPerson, contactPhone, distance,
    } = req.body;

    const mStaff = Number(maleStaff) || 0;
    const fStaff = Number(femaleStaff) || 0;
    const numberOfStaff = mStaff + fStaff;

    if (numberOfStaff < 1) return res.status(400).json({ message: 'At least 1 staff member is required' });

    const eventTypeDoc = await EventType.findById(eventType);
    if (!eventTypeDoc) return res.status(404).json({ message: 'Event type not found' });

    const dist = Number(distance) || 0;
    const travelCharge = dist * 10;
    const staffCharge = numberOfStaff * 850;
    const totalAmount = staffCharge + travelCharge;

    const booking = await Booking.create({
      customer: req.user._id, eventType, eventName, eventDate, eventTime,
      venueName, venueAddress, city, numberOfStaff, maleStaff: mStaff, femaleStaff: fStaff, genderPreference,
      notes, specialRequirements, duration: duration || 8,
      contactPerson: contactPerson || req.user.name,
      contactPhone: contactPhone || req.user.phone,
      totalAmount, distance: dist, travelCharge,
    });

    const populated = await booking.populate(['customer', 'eventType']);

    // Send bill slip SMS to admin (non-blocking — failure won't break booking)
    try {
      await sendBookingSlipSMS(
        populated,
        populated.customer,
        populated.eventType
      );
      console.log('✅ Booking slip SMS sent to admin');
    } catch (smsErr) {
      console.error('⚠️  SMS send failed (booking still saved):', smsErr.message);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get bookings (customer: own | admin: all)
// @route GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (req.user.role === 'customer') query.customer = req.user._id;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('customer', 'name email phone')
        .populate('eventType', 'name icon')
        .populate('staffAssigned', 'name gender photo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query),
    ]);
    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single booking
// @route GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('eventType', 'name icon basePrice pricePerStaff')
      .populate('staffAssigned', 'name gender photo phone');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update booking (admin: status, assign; customer: cancel)
// @route PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    let shouldEmailCustomer = false;

    if (req.user.role === 'customer') {
      if (booking.customer.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'Access denied' });
      if (booking.status !== 'pending')
        return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
      booking.status = 'cancelled';
    } else {
      // Admin
      const { status, staffAssigned, adminNotes, totalAmount, advancePaid } = req.body;
      
      if (status && booking.status !== status) {
        booking.status = status;
        shouldEmailCustomer = true;
      }
      
      if (staffAssigned) {
        booking.staffAssigned = staffAssigned;
        // Update staff booking counts
        await Staff.updateMany({ _id: { $in: staffAssigned } }, { $inc: { totalBookings: 1 } });
      }
      
      if (adminNotes !== undefined && booking.adminNotes !== adminNotes) {
        booking.adminNotes = adminNotes;
        if (adminNotes.trim() !== '') {
          shouldEmailCustomer = true;
        }
      }
      
      if (totalAmount !== undefined) booking.totalAmount = totalAmount;
      if (advancePaid !== undefined) booking.advancePaid = advancePaid;
    }
    
    const updated = await booking.save();
    
    // Dispatch customer notification asynchronously
    if (shouldEmailCustomer && req.user.role === 'admin') {
      Booking.findById(updated._id).populate('customer').populate('eventType')
        .then(populated => {
          if (populated) sendCustomerStatusEmail(populated, populated.customer, populated.eventType);
        })
        .catch(err => console.error('Failed to dispatch status email:', err.message));
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get booking stats (admin)
// @route GET /api/bookings/stats
const getBookingStats = async (req, res) => {
  try {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
    ]);
    const revenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const monthlyBookings = await Booking.aggregate([
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);
    res.json({ total, pending, confirmed, completed, cancelled, revenue: revenue[0]?.total || 0, monthlyBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, getBookingById, updateBooking, getBookingStats };
