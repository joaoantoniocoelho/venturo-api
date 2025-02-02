const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { sendPasswordResetEmail } = require('../services/emailService');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, language } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn(`Registration attempt with existing email`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password_hash: hashedPassword,
            language,
        });

        await newUser.save();

        logger.info(`New user registered successfully`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            logger.warn(`Login attempt with invalid email`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            logger.warn(`Login attempt with incorrect password`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        logger.info(`User logged in successfully`);
        res.json({ token });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            logger.warn(`Password reset requested for a non-existent email`);
            return res.status(400).json({ message: 'If an account with this email exists, a password reset email will be sent' });
        }

        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: '15m' });

        await sendPasswordResetEmail(user.email, resetToken);

        logger.info(`Password reset email sent successfully`);
        res.json({ message: 'If an account with this email exists, a password reset email will be sent' });
    } catch (error) {
        logger.error(`Password reset request error: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.body;

        logger.info(`Verifying password reset token`);
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        
        res.json({ valid: true, userId: decoded.id });
    } catch (error) {
        logger.warn(`Invalid or expired password reset token`);
        res.status(400).json({ valid: false, message: 'Invalid or expired token' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        logger.info(`Processing password reset`);

        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);    
        const user = await User.findById(decoded.id);

        if (!user) {
            logger.warn(`Password reset attempt with invalid token`);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(newPassword, salt);
        await user.save();

        logger.info(`Password reset completed successfully`);
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        logger.error(`Password reset error: ${error.message}`);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { registerUser, loginUser, requestPasswordReset, verifyResetToken, resetPassword };
