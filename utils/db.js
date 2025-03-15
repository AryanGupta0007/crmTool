const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const client = await mongoose.connect("mongodb+srv://aryanguptadev007:kcAUlXR5WNnvU2mN@cluster0.dbfaf.mongodb.net/crm?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;