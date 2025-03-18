const Lead = require('../models/Lead');

exports.getUnderReviewLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ status: 'under-review' });
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching closed-success leads', error });
    }
};

exports.updateVerificationStatus = async (req, res) => {
    try {
        const { leadId, verificationStatus } = req.body;
        console.log(leadId, verificationStatus)
        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        if (verificationStatus === "verified"){
            lead.status = "closed-success"
        }
        else if (verificationStatus === "fake"){
            lead.status = "closed-failed"
        }
        else{
            lead.status = "under-review"
        }
        lead.paymentVerified = verificationStatus;
        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error updating verification status', error });
    }
};
