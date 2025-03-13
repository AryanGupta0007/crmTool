const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: false },
    contactNumber: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    leads: {
        alloted: { type: Number, default: 0 },
        lead_details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }]
    }
});

module.exports = mongoose.model('Employee', employeeSchema);