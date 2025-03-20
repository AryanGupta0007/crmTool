const Batch = require('../models/Batch')
exports.getBatches = async(req, res) => {
    try{
        const batches = Batch.find({status: 'active'})
        return res.status(200).json(batches)    
    }
    catch(error){
        return res.status(400).json(error)
    }
}