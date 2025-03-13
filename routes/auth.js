const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const generateToken = (entity) => {
    const data = {
        user: {
            id: entity.id
        }
    }
    return jwt.sign(data, process.env.JWT_SECRET);
}

// Register (User or Driver)
router.post('/register', async (req, res) => {
    const {
        email,
        password,
        name
    } = req.body;
    try {
        if (!['employee', 'admin'].includes(role)) {
            const msg = 'Invalid role';
            logger.error(msg);
            return res.status(400).json({ msg });
        }
        let entity;
        const cryptPassword = await bcrypt.hash(password, 10);


        const Model = role === 'employee' ? Employee : Admin;
        entity = await Model.findOne({ email });
        if (entity) {
            const msg = `${role} already registered`;
            logger.error(msg);
            return res.status(400).json({ msg });
        }
        entity = new Model({
            email,
            name,
            password: cryptPassword,
        });

        console.log(entity);
        await entity.save();

        const authToken = await generateToken(entity);
        const msg = `${role} registered`;
        logger.info(msg);
        res.json({ msg, entity, authToken });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Login (Verify Credentials)
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        let entity;

        if (!['admin', 'employee'].includes(role)) {
            const msg = 'Invalid role';
            logger.error(msg);
            return res.status(400).json({ msg });
        }

        const Model = role === 'admin' ? Admin : Employee;
        console.log("model:", Model);
        entity = await Model.findOne({ email });
        if (!entity) {
            const msg = `${role} not found`;
            logger.error(msg);
            return res.status(404).json({ msg });
        }


        const comparePass = await bcrypt.compare(password, entity.password);
        if (!comparePass) {
            const msg = "Invalid Credentials";
            logger.error(msg);
            return res.status(400).json({ msg });
        }

        const authToken = generateToken(entity);
        const msg = `${role} logged in successfully`;
        logger.info(msg);
        return res.status(200).json({ msg, entity, authToken });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
