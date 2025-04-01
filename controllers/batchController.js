const Batch = require('../models/Batch');

exports.getBatches = async (req, res) => {
    try {
        const batches = await Batch.find();
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching batches', error });
    }
};
