const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify', authController.verifyToken, (req, res) => {
    res.status(200).json({ msg: 'Token is valid', user: req.user });
});

module.exports = router;
