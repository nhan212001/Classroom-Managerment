const { db } = require('../config/firebase')
const { validateUserName, sendOTP, sendSMS, generateOTP, createToken, sendESMS } = require('../utils/comon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const loginCheck = async (req, res) => {
    try {
        const { userName } = req.body;
        const type = validateUserName(userName);
        let query;
        if (type === 'phone') {
            query = db.collection('users').where('phone', '==', userName);
        } else if (type === 'email') {
            query = db.collection('users').where('email', '==', userName);
        } else {
            return res.status(400).json({ error: 'Invalid user name' });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = snapshot.docs[0].data();
        if (user.status !== 'active') {
            return res.status(404).json({ error: 'User inactive' });
        } else {
            if (user.role === "instructor") {
                try {
                    const otp = generateOTP();
                    await db.collection('accessCodes').doc(user.phone).set({
                        code: otp,
                        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
                        email: user.email
                    });
                    // sendESMS(user.phone, otp);
                    return res.json({ role: user.role, phone: user.phone, otp });
                } catch (otpError) {
                    return res.status(500).json({ error: 'Create OTP failed', detail: otpError.message });
                }
            } else if (user.role === "student") {
                return res.json({ role: user.role });
            } else {
                return res.status(404).json({ error: 'Role not found' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginOtp = async (req, res) => {
    try {
        const { userName, otp } = req.body;
        const type = validateUserName(userName);
        let otpData;
        if (type === 'unknown') {
            return res.status(400).json({ error: 'Invalid user name' });
        }
        if (type === 'phone') {
            const otpDoc = await db.collection('accessCodes').doc(userName).get();
            if (!otpDoc.exists) {
                return res.status(404).json({ error: 'OTP not found' });
            }
            otpData = otpDoc.data();
        } else {
            const otpQuery = await db.collection('accessCodes').where('email', '==', userName).get();
            if (otpQuery.empty) {
                return res.status(404).json({ error: 'OTP not found' });
            }
            otpData = otpQuery.docs[0].data();
        }

        if (otpData.code !== otp) {
            return res.status(400).json({ error: 'OTP not found' });
        }
        if (new Date() > otpData.expiredAt.toDate()) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        const userQuery = type === 'phone' ?
            db.collection('users').where('phone', '==', userName) :
            db.collection('users').where('email', '==', userName);
        const userSnapshot = await userQuery.get();
        const user = userSnapshot.docs[0].data();
        delete user.passwordHash;
        // Tạo JWT token
        const token = createToken({ ...user, id: userSnapshot.docs[0].id });
        return res.json({ message: 'Login successful', user: { ...user, id: userSnapshot.docs[0].id }, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginPw = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const type = validateUserName(userName);

        if (type === 'unknown') {
            return res.status(400).json({ error: 'Invalid user name' });
        }
        const userQuery = type === 'phone' ?
            db.collection('users').where('phone', '==', userName) :
            db.collection('users').where('email', '==', userName);

        const userSnapshot = await userQuery.get();
        if (userSnapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = userSnapshot.docs[0].data();
        const hash = await bcrypt.hash(password, 10);

        console.log('hash', hash);


        if (!bcrypt.compareSync(password, user?.passwordHash || '')) {
            return res.status(400).json({ error: 'Wrong password' });
        }
        console.log();

        delete user.passwordHash;
        const token = createToken({ ...user, id: userSnapshot.docs[0].id });
        return res.json({ message: 'Login successful', user: { ...user, id: userSnapshot.docs[0].id }, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createOtp = async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }
    try {
        const otp = generateOTP();
        await db.collection('accessCodes').doc(phone).set({
            code: otp,
            expiredAt: new Date(Date.now() + 5 * 60 * 1000)
        });
        return res.json({ otp });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const verifyToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;
        const userData = await db.collection('users').doc(id).get();
        const user = userData.data();
        delete user.passwordHash;

        return res.json({
            message: 'Token is valid',
            user: {
                ...user,
                id
            },
            token
        });
    } catch (error) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
};

module.exports = {
    loginCheck,
    loginOtp,
    loginPw,
    verifyToken,
    createOtp
};