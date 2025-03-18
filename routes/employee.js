const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const employeeController = require('../controllers/employeeController');

router.post('/updateLeadStatus', employeeController.updateLeadStatus);
router.get('/leads', employeeController.getLeads);
router.get('/sales', employeeController.getSalesLeads); // Add sales route
router.put('/updateLeadComment', employeeController.updateLeadComment); // Add route to update lead comment
router.post('/uploadPaymentProof', upload.single('proof'), employeeController.uploadPaymentProof); // Add route to upload payment proof

module.exports = router;
