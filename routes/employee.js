const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/updateLeadStatus', employeeController.updateLeadStatus);
router.get('/leads', employeeController.getLeads);

module.exports = router;
