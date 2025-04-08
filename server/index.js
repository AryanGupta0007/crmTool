require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../utils/db');
const adminRoutes = require('../routes/admin');
const employeeRoutes = require('../routes/employee'); // Correctly import employeeRoutes
const authRoutes = require('../routes/auth');
const accountsRoutes = require('../routes/accountsRoutes'); // Add accounts routes
const operationsRoutes = require('../routes/operationsRoutes'); // Add operations routes
const genRoutes = require('../routes/gen'); // Add gen routes

const path = require('path');
const { verifyToken } = require('../controllers/authController');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Use CORS with detailed configuration
app.use(cors({
    origin: '*', // Allow all origins; adjust if needed (e.g., "http://localhost:3000")
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Disable ETag and remove Last-Modified to prevent 304 Not Modified issues
app.disable('etag');
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.removeHeader('Last-Modified');
    next();
});

app.use(express.json());

// ✅ Define API routes first
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', verifyToken, employeeRoutes); // Use employee routes
app.use('/api/accounts', accountsRoutes); // Use accounts routes
app.use('/api/operations', operationsRoutes); // Use operations routes
app.use('/api/gen', genRoutes); // Register gen routes

// ✅ Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, '../../CRM-Frontend/dist')));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../CRM-Frontend/dist', 'index.html'));
});

// ✅ Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
