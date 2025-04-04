const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    eventType: { type: String, required: true },
    eventName: { type: String, required: true },
    hostName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    totalCost: { type: Number, required: true },
    advancePayment: { type: Number, required: true },
    pendingPayment: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
