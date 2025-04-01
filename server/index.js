require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../utils/db');
const adminRoutes = require('../routes/admin');
const employeeRoutes = require('../routes/employee'); // Correctly import employeeRoutes
const authRoutes = require('../routes/auth');
const accountsRoutes = require('../routes/accountsRoutes'); // Add accounts routes
const operationsRoutes = require('../routes/operationsRoutes'); // Add operations routes
const genRoutes = require('../routes/operationsRoutes'); // Add operations routes

const path = require('path');
const { verifyToken } = require('../controllers/authController');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

try{
// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../CRM-Frontend/dist')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../CRM-Frontend/dist', 'index.html'));

});}
catch(err){
    console.log("build doesn't exist")
}

// Use CORS with detailed configuration
app.use(cors({
    origin: '*', // Allow all origins; adjust if needed (e.g., "http://localhost:3000")
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.disable('etag');
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', verifyToken, employeeRoutes); // Use employee routes
app.use('/api/accounts', accountsRoutes); // Use accounts routes
app.use('/api/operations', operationsRoutes); // Use operations routes
app.use('/api/gen', genRoutes); // Use operations routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads directory

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
