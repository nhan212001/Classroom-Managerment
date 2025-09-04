const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!authHeader) return res.status(403).json({ error: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.phone = decoded.phone;
        req.email = decoded.email;
        req.role = decoded.role;
        req.id = decoded.id;
        if (decoded.role !== 'instructor' && decoded.role !== 'student') {
            return res.status(403).json({ error: 'Invalid role' });
        }
        next();
    });
};

const checkResetPasswordToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.id = decoded.id;
        req.name = decoded.name;
        req.resetPassword = decoded.resetPassword;
        req.email = decoded.email;
        if (!req.resetPassword) {
            return res.status(403).json({ error: 'Invalid reset password token' });
        }
        next();
    });
};

const checkInstructor = (req, res, next) => {
    const { role } = req;
    if (role !== 'instructor') {
        return res.status(403).json({ error: 'Student role is not allowed' });
    }
    next();
};

module.exports = { checkToken, checkInstructor, checkResetPasswordToken };
