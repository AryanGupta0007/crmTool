const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const batchController = require('../controllers/batchController');
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
router.put('/updateNeededLeads/:id', authController.verifyToken, adminController.updateNeededLeads); // Add route to update needed leads
router.get('/resetNeededLeads', authController.verifyToken, adminController.resetNeededLeads); // Add route to update needed leads
router.get('/download-leads/:employeeId', authController.verifyToken, adminController.downloadEmployeeLeads);
router.delete('/employee/:email', authController.verifyToken, adminController.deleteEmployee);
router.get('/batches', authController.verifyToken, adminController.getBatches);
router.post('/addBatch', authController.verifyToken, adminController.addBatch);
router.get('/revenue-per-sale', adminController.getRevenuePerSale);
router.put('/updateBatchStatus/:batchId', adminController.updateBatchStatus);
router.get('/verified-leads', adminController.getVerifiedLeads)
router.put('/updateLeadStatus', adminController.updateLeadStatus)
router.post('/getCallerLeads', adminController.getCallerLeads)
module.exports = router;
