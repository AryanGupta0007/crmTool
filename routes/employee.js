const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authController = require('../controllers/authController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/leads', authController.verifyToken, employeeController.getLeads);
router.post('/updateLeadField', authController.verifyToken, employeeController.updateLeadField);
router.post('/uploadPaymentProof', authController.verifyToken, upload.single('file'), employeeController.uploadPaymentProof);
router.get('/follow-ups', authController.verifyToken, employeeController.getFollowUps);

module.exports = router;
