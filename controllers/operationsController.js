const Lead = require('../models/Lead');

exports.getClosedSuccessLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ status: 'closed-success', paymentVerified: 'verified' });
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching closed-success leads', error });
    }
};

exports.updateOperationStatus = async (req, res) => {
    try {
        const { leadId, field, value } = req.body;
        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        lead[field] = value;
        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating operation status', error });
    }
};

exports.updateAmount = async (req, res) => {
    try {
        const { leadId, amount } = req.body;
        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        lead.amount = amount;
        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating amount', error });
    }
};
