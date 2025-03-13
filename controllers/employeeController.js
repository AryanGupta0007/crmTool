const Lead = require('../models/lead');

exports.updateLeadStatus = async (req, res) => {
    try {
        const { leadId, status } = req.body;
        const lead = await Lead.findById(leadId);
        lead.status = status;
        if (status === 'follow up') {
            lead.followUpDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days later
        }
        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead status', error });
    }
};