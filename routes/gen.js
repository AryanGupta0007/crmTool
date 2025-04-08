const express = require('express');
const router = express.Router();
const genController = require('../controllers/genController');
const authController = require('../controllers/authController');

router.get('/batches', genController.getBatches);
router.get('/user/profile', authController.verifyToken, genController.getUserProfile);

module.exports = router;
