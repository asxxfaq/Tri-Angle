const EventType = require('../models/EventType');

const getEventTypes = async (req, res) => {
  try {
    const events = await EventType.find({ isActive: true });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEventType = async (req, res) => {
  try {
    const { name, description, icon, basePrice, pricePerStaff } = req.body;
    if (!name || basePrice === undefined || pricePerStaff === undefined)
      return res.status(400).json({ message: 'Name, basePrice and pricePerStaff are required' });
    const event = await EventType.create({ name, description, icon, basePrice, pricePerStaff });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEventType = async (req, res) => {
  try {
    const event = await EventType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event type not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEventType = async (req, res) => {
  try {
    const event = await EventType.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event type not found' });
    res.json({ message: 'Event type deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEventTypes, createEventType, updateEventType, deleteEventType };
