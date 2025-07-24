const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure you’ve set up your .env file

const sendResetEmail = async (to, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail or SMTP email
      pass: process.env.EMAIL_PASS  // your app password or email password
    }
  });

  const mailOptions = {
    from: `"SkooLLy" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password - SkooLLy',
    html: `
      <h2>Forgot your password?</h2>
      <p>Click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn’t request this, ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendResetEmail;
