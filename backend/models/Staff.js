const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  phone: { type: String },
  photo: { type: String, default: '' },
  skills: [{ type: String }],
  experience: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  totalBookings: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  age: { type: Number },
  collegeName: { type: String },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
