const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Admin', adminSchema)