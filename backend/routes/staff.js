const express = require('express');
const router = express.Router();
const { getStaff, getStaffById, createStaff, updateStaff, deleteStaff, getStaffStats } = require('../controllers/staffController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/stats', protect, adminOnly, getStaffStats);
router.get('/', getStaff);
router.get('/:id', getStaffById);
router.post('/', protect, adminOnly, upload.single('photo'), createStaff);
router.put('/:id', protect, adminOnly, upload.single('photo'), updateStaff);
router.delete('/:id', protect, adminOnly, deleteStaff);

module.exports = router;
