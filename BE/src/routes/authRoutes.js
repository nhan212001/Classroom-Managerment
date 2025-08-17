const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login-check', authController.loginCheck);
router.post('/login-otp', authController.loginOtp);
router.post('/login-pw', authController.loginPw);
router.post('/create-otp', authController.createOtp);
router.get('/verify-token', authController.verifyToken);

module.exports = router;