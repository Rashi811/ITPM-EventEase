const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    reminder_topic: { type: String, required: true },
    reminder_note: { type: String}, 
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
});

module.exports = mongoose.model("Reminder", reminderSchema);
