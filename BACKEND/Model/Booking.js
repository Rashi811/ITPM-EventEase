const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  venueId: { type: String, required: true },
  eventType: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  specificRequirements: { type: String },
  status: { type: String, default: 'Pending' }, // default to 'Pending'
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;