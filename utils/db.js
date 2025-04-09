const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const client = await mongoose.connect(
            "mongodb+srv://buddingmarinersstore:eoPOEAbvMLYMRHyT@cluster0.wzhjhwz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
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