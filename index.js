require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const fs = require("fs");
const logger = require("./logger");

// const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 3000;

// Ensure the logs directory exists
const logDirectory = "logs";
if (!fs.existsSync(logDirectory)) {
fs.mkdirSync(logDirectory);
}

app.use(express.json());

// Middleware to log all requests
app.use((req, res, next) => {
logger.info(`${req.method} ${req.url}`);
next();
});

mongoose.connect(process.env.MONGODB_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// app.use('/api/auth', authRoutes);
// app.use('/api/ride', rideRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/user', userRoutes); // New
// app.use('/api/driver', driverRoutes); // New

app.listen(PORT, () => {
logger.info(`Server is running on port ${PORT}`);
});
