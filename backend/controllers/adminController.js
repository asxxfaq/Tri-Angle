const User = require('../models/User');
const Booking = require('../models/Booking');
const Staff = require('../models/Staff');

// @desc Get all customers
// @route GET /api/admin/customers
const getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'customer' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle customer active status
// @route PUT /api/admin/customers/:id/toggle
const toggleCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'customer') return res.status(404).json({ message: 'Customer not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `Customer ${user.isActive ? 'activated' : 'suspended'}`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin overview dashboard stats
// @route GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [totalBookings, pendingBookings, totalCustomers, totalStaff, activeStaff] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'customer' }),
      Staff.countDocuments(),
      Staff.countDocuments({ status: 'active', availability: true }),
    ]);

    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const recentBookings = await Booking.find()
      .populate('customer', 'name')
      .populate('eventType', 'name icon')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalBookings, pendingBookings, totalCustomers, totalStaff,
      activeStaff, revenue: revenueAgg[0]?.total || 0, recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCustomers, toggleCustomer, getDashboard };
