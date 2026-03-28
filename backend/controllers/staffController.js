const Staff = require('../models/Staff');

// @desc  Get all staff (with filters)
// @route GET /api/staff
const getStaff = async (req, res) => {
  try {
    const { gender, status, availability, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (gender) query.gender = gender;
    if (status) query.status = status;
    if (availability !== undefined) query.availability = availability === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [staff, total] = await Promise.all([
      Staff.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Staff.countDocuments(query),
    ]);
    res.json({ staff, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single staff
// @route GET /api/staff/:id
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create staff
// @route POST /api/staff
const createStaff = async (req, res) => {
  try {
    const { name, gender, phone, skills, experience, age, collegeName, notes } = req.body;
    if (!name || !gender) return res.status(400).json({ message: 'Name and gender are required' });

    const photo = req.file ? `/uploads/staff/${req.file.filename}` : '';
    const skillsArr = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills || [];
    const staff = await Staff.create({ name, gender, phone, photo, skills: skillsArr, experience, age, collegeName, notes });
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update staff
// @route PUT /api/staff/:id
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const { name, gender, phone, skills, experience, age, collegeName, notes, status, availability } = req.body;
    staff.name = name ?? staff.name;
    staff.gender = gender ?? staff.gender;
    staff.phone = phone ?? staff.phone;
    staff.experience = experience ?? staff.experience;
    staff.age = age ?? staff.age;
    staff.collegeName = collegeName ?? staff.collegeName;
    staff.notes = notes ?? staff.notes;
    staff.status = status ?? staff.status;
    staff.availability = availability !== undefined ? availability : staff.availability;
    if (skills) staff.skills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
    if (req.file) staff.photo = `/uploads/staff/${req.file.filename}`;

    const updated = await staff.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete staff
// @route DELETE /api/staff/:id
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    await staff.deleteOne();
    res.json({ message: 'Staff removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get staff stats
// @route GET /api/staff/stats
const getStaffStats = async (req, res) => {
  try {
    const total = await Staff.countDocuments();
    const active = await Staff.countDocuments({ status: 'active' });
    const male = await Staff.countDocuments({ gender: 'male' });
    const female = await Staff.countDocuments({ gender: 'female' });
    const available = await Staff.countDocuments({ availability: true });
    res.json({ total, active, male, female, available });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStaff, getStaffById, createStaff, updateStaff, deleteStaff, getStaffStats };
