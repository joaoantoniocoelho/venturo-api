const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperação de Senha - Venturo',
        html: `
            <h2>Recuperação de Senha</h2>
            <p>Clique no botão abaixo para redefinir sua senha. O link é válido por 15 minutos.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
            <p>Se você não solicitou a recuperação, ignore este e-mail.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};


module.exports = { sendPasswordResetEmail  };