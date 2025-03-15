const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: 'new' },
    followUpDate: { type: Date, default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    paymentVerified: {type: Boolean, default: false},
    amount: {type: String, required: false}
});

module.exports = mongoose.model('Lead', leadSchema);