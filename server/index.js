require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../utils/db');
const adminRoutes = require('../routes/admin');
const employeeRoutes = require('../routes/employee'); // Correctly import employeeRoutes
const authRoutes = require('../routes/auth');
const accountsRoutes = require('../routes/accountsRoutes'); // Add accounts routes
const operationsRoutes = require('../routes/operationsRoutes'); // Add operations routes
const path = require('path');
const { verifyToken } = require('../controllers/authController');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', verifyToken, employeeRoutes); // Use employee routes
app.use('/api/accounts', accountsRoutes); // Use accounts routes
app.use('/api/operations', operationsRoutes); // Use operations routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads directory

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
