const Lead = require('../models/Lead');
const Batch = require('../models/Batch');

exports.getUnderReviewLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ status: 'under-review' }).sort({ lastModified: -1 });
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching closed-success leads', error });
    }
};

exports.getBatch = async (req, res) => {
    try {
        const { batchId, books } = req.body;

        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required" });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        let amount;
        if (books) {
            amount = parseInt(batch.price) + parseInt(batch.booksPrice);
        } else {
            amount = parseInt(batch.price);
        }

        res.status(200).json({ amount, batch });
    } catch (error) {
        console.error("Error fetching batch:", error);
        res.status(500).json({ message: "Error fetching batch", error });
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
