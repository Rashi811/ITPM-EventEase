const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventType: { type: String, required: true },
    eventName: { type: String, required: true, unique: true }, 
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    guestDetails: { type: String },
    specialNotes: { type: String }
});

module.exports = mongoose.model("Event", eventSchema);
