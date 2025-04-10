const Batch = require('../models/Batch');
const Employee = require('../models/Employee');
const Admin = require('../models/Admin');

exports.getBatches = async(req, res) => {
    try{
        const batches = Batch.find({status: 'active'});
        return res.status(200).json(batches);    
    }
    catch(error){
        return res.status(400).json(error);
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const { userId, role } = req;
        let user;

        if (role === 'admin') {
            user = await Admin.findById(userId).select('-password');
        } else {
            user = await Employee.findById(userId).select('-password');
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Include the employee type in the response
        const response = {
            ...user.toObject(),
            type: user.type || null
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
};