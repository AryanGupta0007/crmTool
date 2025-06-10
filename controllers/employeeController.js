const Lead = require('../models/Lead');
const path = require('path');
const fs = require('fs');
const Batch = require('../models/Batch')
exports.updateLeadField = async (req, res) => {
    try {
        const { leadId, field, value } = req.body;
        const lead = await Lead.findById(leadId);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        // Update the specified field
        lead[field] = value;
        
    

        // Handle specific logic for certain fields
        if (field === 'status' && value === 'follow up') {
            lead.followUpDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days later
        } else if (field === 'formSs' && value) {
            lead.status = 'under-review';
        }

        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead field', error });
    }
};

exports.uploadPaymentProof = async (req, res) => {
    try {
        const { leadId, proofType } = req.body;
        console.log(`leadId: ${leadId}`)
        const lead = await Lead.findById(leadId);
        console.log(lead)
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        console.log(`uploaded filename: ${req.file.filename}`)
        if (proofType === "payment") {
            lead.paymentProof = req.file.filename;
        }
        else if (proofType == "book") {
            lead.booksSs = req.file.filename;
        }

        else if (proofType == "form") {
            lead.formSs = req.file.filename;
            lead.status = "under-review"
        }


        await lead.save();

        res.status(200).json({ message: 'Payment proof uploaded successfully', lead });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error uploading payment proof', error });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ assignedTo: req.userId }).sort({ lastModified: -1 });
        // console.log(leads)
        res.status(200).json(leads);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching leads', error });
    }
};

exports.getFollowUps = async (req, res) => {
    try {
        const leads = await Lead.find({ assignedTo: req.userId });
        const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const followUpsToday = leads.filter(lead => lead.followUpDate === today);
        res.status(200).json(followUpsToday);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching follow-ups', error });
    }
};

exports.getSalesLeads = async (req, res) => {
    try {
        const salesLeads = await Lead.find({ status: 'closed-success', assignedTo: req.userId });
        res.status(200).json(salesLeads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales leads', error });
    }
};