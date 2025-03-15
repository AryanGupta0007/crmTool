const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/addLeads', authController.verifyToken, upload.single('file'), adminController.addLeads);
router.post('/allotLeads', authController.verifyToken, adminController.allotLeads);
router.get('/dashboardStats', authController.verifyToken, adminController.getDashboardStats);
router.get('/callers', authController.verifyToken, adminController.getCallers);
router.get('/unassigned-leads', authController.verifyToken, adminController.getUnassignedLeads);
router.get('/leads', authController.verifyToken, adminController.getLeads);
router.post('/assignLead', authController.verifyToken, adminController.assignLead);
router.get('/revenue', authController.verifyToken, adminController.getRevenue);
router.get('/sales', authController.verifyToken, adminController.getSalesLeads); // Add sales route

module.exports = router;
