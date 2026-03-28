const express = require('express');
const router = express.Router();
const { getEventTypes, createEventType, updateEventType, deleteEventType } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getEventTypes);
router.post('/', protect, adminOnly, createEventType);
router.put('/:id', protect, adminOnly, updateEventType);
router.delete('/:id', protect, adminOnly, deleteEventType);

module.exports = router;
