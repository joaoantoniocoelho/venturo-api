const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPasswordResetEmail = async (email, token) => {
    try {
        const anonymizedEmail = anonymizeEmail(email);
        logger.info(`Initiating password reset email to ${anonymizedEmail}`);

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        const mailOptions = {
            from: `"Venturo Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Venturo - Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password. Click the button below to proceed:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link is valid for 15 minutes. If you did not request this, you can ignore this email.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Password reset email successfully sent to ${anonymizedEmail}`);
    } catch (error) {
        logger.error(`Failed to send password reset email: ${error.message}`);
    }
};

const anonymizeEmail = (email) => {
    const [username, domain] = email.split('@');
    if (!username || !domain) return 'Invalid email';
    
    const usernameAnonymized = username.length > 2 
        ? `${username[0]}***${username[username.length - 1]}` 
        : `${username[0]}***`;

    return `${usernameAnonymized}@${domain}`;
};

module.exports = { sendPasswordResetEmail };
