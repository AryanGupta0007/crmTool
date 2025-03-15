const Lead = require('../models/Lead');

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

exports.getLeads = async (req, res) => {
    try {
        // const {id} = req.body
        const leads = await Lead.find({ assignedTo: req.userId });
        console.log(leads)
        res.status(200).json(leads);
    } catch (error) {
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