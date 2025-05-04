const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const confirmSchema = new Schema({
    email: { type: String, required: true },
    reminder_note: { type: String },
    confirm: { type: Boolean, default: false },
    reson: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("ConfirmReminder", confirmSchema);
