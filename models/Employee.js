const mongoose = require('mongoose');
const employeeSchema = mongoose.Schema({
    name: {type: String, required: false},
    contactNumber: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true}
})
module.exports = mongoose.model('Employee', employeeSchema)