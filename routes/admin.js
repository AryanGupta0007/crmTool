const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/addLeads', upload.single('file'), adminController.addLeads);
router.post('/allotLeads', adminController.allotLeads);
router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/callers', adminController.getCallers);
router.get('/unassigned-leads', adminController.getUnassignedLeads);
router.post('/assignLead', adminController.assignLead);
router.get('/revenue', adminController.getRevenue);

module.exports = router;