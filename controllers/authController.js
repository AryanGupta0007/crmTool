const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

const JWT_SECRET = "JLFSJLFSLJfsjflsaj"
exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        let user;
        if (role === 'admin') {
            user = await Admin.findOne({ email });
        } else {
            user = await Employee.findOne({ email });
        }

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ authToken: token, role });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

exports.register = async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        if (!['admin', 'employee'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role' });
        }

        let user;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'admin') {
            user = await Admin.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'Admin already registered' });
            }
            user = new Admin({ email, name, password: hashedPassword });
        } else {
            user = await Employee.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'Employee already registered' });
            }
            user = new Employee({ email, name, password: hashedPassword });
        }

        await user.save();
        const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ authToken: token, role });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ msg: 'Server error', error });
    }
};
