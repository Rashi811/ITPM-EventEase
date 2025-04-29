const mongoose = require('mongoose');

const VenueSuggestionSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  venueName: { type: String, required: true },
  location: { type: String, required: true },
  eventType: { type: String, required: true },
  capacity: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  specificRequirements: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VenueSuggestion', VenueSuggestionSchema);