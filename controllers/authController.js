const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

const JWT_SECRET = "JLFSJLFSLJfsjflsaj";

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
        res.json({ authToken: token, role: role });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    console.log(`token: ${token}`)
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    const bearerToken = token.split(" ")[1];
    if (!bearerToken) {
        return res.status(403).send({ message: "Invalid token format!" });
    }

    jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        console.log(`decoded: ${decoded.id}`)
        req.userId = decoded.id;
        // console.log(`userID: ${req.userId}}`)
        next();
    });
};

exports.register = async (req, res) => {
    const { email, password, name, role, type } = req.body;
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
            user = new Employee({ email, name, password: hashedPassword, type });
        }

        await user.save();
        const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ authToken: token, role });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ msg: 'Server error', error });
    }
};
