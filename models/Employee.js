const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: false },
    contactNumber: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: {type: String, enums: ["sales", "accounts", "operations"], required: true, default: "sales"},
    status: {type: String, default: 'active'},
    leads: {
        needed: {type: Number, default: 0},
        alloted: { type: Number, default: 0 },
        lead_details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }]
    }
});
employeeSchema.pre('findOneAndDelete', async function (next) {
    const employee = await this.model.findOne(this.getFilter());  // Fetch employee being deleted
    if (employee && employee.leads.lead_details.length > 0) {
        await mongoose.model('Lead').deleteMany({ _id: { $in: employee.leads.lead_details } });
    }
    next();
});

module.exports = mongoose.model('Employee', employeeSchema);