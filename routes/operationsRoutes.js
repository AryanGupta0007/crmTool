const express = require('express');
const router = express.Router();
const operationsController = require('../controllers/operationsController');
const authController = require('../controllers/authController');

router.get('/closed-success-leads', authController.verifyToken, operationsController.getClosedSuccessLeads);
router.put('/updateOperationStatus', authController.verifyToken, operationsController.updateOperationStatus);
router.put('/updateAmount', authController.verifyToken, operationsController.updateAmount);

module.exports = router;
