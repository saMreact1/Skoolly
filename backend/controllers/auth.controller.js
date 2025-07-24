const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const nodemailer = require('nodemailer')
const School = require('../models/school.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token');

exports.register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    role = 'student',
    schoolName,
    schoolType,
    address,
    state,
    phone,
    gender,
    bio
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    let school = await School.findOne({ name: schoolName });

    // If registering as admin
    if (role === 'admin') {
      if (school) {
        return res.status(400).json({ message: 'An admin is already registered for this school.' });
      }

      // Create school
      school = await School.create({
        name: schoolName,
        address: address,
        state: state,
        schoolType: schoolType,
        phone: phone,
        gender: gender,
        bio: bio
      });
    }

    // For students/teachers, school must exist
    if (!school) {
      return res.status(400).json({ message: 'School does not exist. Please contact the admin.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      gender,
      bio,
      school: school._id
    });

    const token = generateToken(user);
    res.status(201).json({ user, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) return res.status(404).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user);

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.checkSchoolAndEmail = async (req, res) => {
  const { email, school } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    const schoolExists = await School.findOne({ name: school });

    return res.status(200).json({
      emailExists: !!emailExists,
      schoolExists: !!schoolExists,
    });
  } catch (err) {
    res.status(500).json({ message: 'Check failed', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const resetLink = `http://localhost:4200/reset-password/${token}`;

    // Set up your transporter (update with real credentials or use ethereal)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g. samueladeleke@gmail.com
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Task Manager" <no-reply@taskmanager.com>',
      to: email,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res.status(400).json({ message: 'Token and new password required' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
