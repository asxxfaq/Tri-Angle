const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: mongoose.Schema.Types.ObjectId, ref: 'EventType', required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  venueName: { type: String, required: true },
  venueAddress: { type: String, required: true },
  city: { type: String, required: true },
  numberOfStaff: { type: Number, required: true, min: 1 },
  maleStaff: { type: Number, default: 0 },
  femaleStaff: { type: Number, default: 0 },
  genderPreference: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
  staffAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  totalAmount: { type: Number, default: 0 },
  advancePaid: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  travelCharge: { type: Number, default: 0 },
  notes: { type: String },
  specialRequirements: { type: String },
  adminNotes: { type: String },
  duration: { type: Number, default: 8 }, // hours
  contactPerson: { type: String },
  contactPhone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
