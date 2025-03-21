const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const authController = require('../controllers/authController');

router.get('/under-review-leads', authController.verifyToken, accountsController.getUnderReviewLeads);
router.put('/updateVerificationStatus', authController.verifyToken, accountsController.updateVerificationStatus);
router.post('/batch', authController.verifyToken, accountsController.getBatch);

module.exports = router;
