const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// adminSchema.pre('save', function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     this.password = bcrypt.hashSync(this.password, 10);
//     next();
// });

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);