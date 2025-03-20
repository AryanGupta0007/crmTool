const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: {type: String, required: true},
    booksPrice: {type: String, required: true},
    status: {type: String, enums: ["active", "completed"], default: "active"}
});

module.exports = mongoose.model('Batch', batchSchema);