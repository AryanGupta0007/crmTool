const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/addLeads', upload.single('file'), adminController.addLeads);
router.post('/allotLeads', adminController.allotLeads);

module.exports = router;