const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: false },
    contactNumber: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    leads: {
        alloted: { type: Number, default: 0 },
        lead_details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }]
    }
});

employeeSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);