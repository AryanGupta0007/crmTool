const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, default: 'new' },
    followUpDate: { type: Date, default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    paymentVerified: { type: String, enum: ["verified", "fake", "unverified"], default: "unverified" },
    amount: { type: String, required: false },
    comment: { type: String, required: false },
    paymentProof: { type: String},
    operationStatus: {type: String, enum: ["completed", "remaining"], default: "remaining"}
     // Ensure this is a string to store the filename
});

module.exports = mongoose.model('Lead', leadSchema);