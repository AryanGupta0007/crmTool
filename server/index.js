require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../utils/db');
const adminRoutes = require('../routes/admin');
const employeeRoutes = require('../routes/employee');
const authRoutes = require('../routes/auth');
const { verifyToken } = require('../controllers/authController');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', verifyToken, adminRoutes);
app.use('/api/employee', verifyToken, employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
