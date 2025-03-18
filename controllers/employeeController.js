const Lead = require('../models/Lead');
const path = require('path');
const fs = require('fs');

exports.updateLeadStatus = async (req, res) => {
    try {
        const { leadId, status } = req.body;
        const lead = await Lead.findById(leadId);
        lead.status = status;
        if (status === 'follow up') {
            lead.followUpDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days later
        }
        await lead.save();
        console.log(`updated ${lead}`)
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead status', error });
    }
};



exports.updateLeadComment = async (req, res) => {
    try {
        const { leadId, comment } = req.body;
        const lead = await Lead.findById(leadId);
        lead.comment = comment;
        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead comment', error });
    }
};

exports.uploadPaymentProof = async (req, res) => {
    try {
        const { leadId } = req.body;
        console.log(`leadId: ${leadId}`)
        const lead = await Lead.findById(leadId);
        console.log(lead)
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = path.join(__dirname, '../uploads', req.file.filename );
        console.log(`uploaded filename: ${req.file.filename}`)
        lead.paymentProof = req.file.filename;
        lead.status = "under-review"
        await lead.save();

        res.status(200).json({ message: 'Payment proof uploaded successfully', lead });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error uploading payment proof', error });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ assignedTo: req.userId });
        console.log(leads)
        res.status(200).json(leads);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching leads', error });
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