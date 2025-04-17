const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNumber: { type: String, required: true, unique: true },
    status: { type: String, default: 'new', enum: ['new', 'PICK', 'DNP', 'CTC', 'CB', 'NA', 'under-review', 'closed-success'] },
    boardsPass: { type: String, enum: ['2024', '2025', '2026', '2027'] },
    boardsEnglish: { type: String, enum: ['<60', '>60 AND <65','>65 AND <70','>70 AND <80','>80 AND <90','>90 ']},
    boardsPCM: { type: String, enum: ['<60', '>60 AND <65','>65 AND <70','>70 AND <80','>80 AND <90','>90 ']},
    followUpDate: { type: String, default: null },
    salesStatus: {type: String, default: null},
    batch: {type: mongoose.Schema.Types.ObjectId, ref: "Batch"},
    formSs: {type: String, default: null},
    books: {type: Boolean, default: null},
    booksSs: {type: String, default: null},    
    paymentVerified: { type: String, enum: ["verified", "fake", "unverified"], default: "unverified" },
    amount: { type: String, required: false , default: null},
    comment: { type: String, required: false , default: null},
    paymentProof: { type: String , default: null},
    addedToGroup: { type: String, enum: ["completed", "remaining"], default: "remaining" },
    registeredOnApp: { type: String, enum: ["completed", "remaining"], default: "remaining" },
    source: {type: String, default: "direct"},
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
    // Ensure this is a string to store the filename
});

module.exports = mongoose.model('Lead', leadSchema);