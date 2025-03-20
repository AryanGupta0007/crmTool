const express = require('express');
const router = express.Router();
const genController = require('../controllers/genController');

router.get('/batches', genController.getBatches);

module.exports = router;
