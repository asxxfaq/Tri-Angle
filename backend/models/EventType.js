const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  icon: { type: String, default: '🎉' },
  basePrice: { type: Number, required: true },
  pricePerStaff: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('EventType', eventTypeSchema);
