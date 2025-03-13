require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/db');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});