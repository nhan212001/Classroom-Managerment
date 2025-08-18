const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const middlewares = require('../middlewares/authMiddlewares');

router.post('/login-check', authController.loginCheck);
router.post('/login-otp', authController.loginOtp);
router.post('/login-pw', authController.loginPw);
router.post('/create-otp', authController.createOtp);
router.get('/verify-token', authController.verifyToken);
router.post('/reset-password', middlewares.checkResetPasswordToken, authController.resetPassword);

module.exports = router;