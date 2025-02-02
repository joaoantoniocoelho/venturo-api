const express = require('express');
const { registerUser, loginUser, requestPasswordReset, verifyResetToken, resetPassword } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', requestPasswordReset);
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

module.exports = router;
