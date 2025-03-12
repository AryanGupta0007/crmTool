const mongoose = require('mongoose');
const leadSchema = mongoose.Schema({
    name: {type: String, required: true},
    contactDetails: {
        mobileNumber: {type: String, required: true},
        email: {type: String, required: true}
    },
    progress: {type: String}

})
module.exports = mongoose.model("Lead", leadSchema)