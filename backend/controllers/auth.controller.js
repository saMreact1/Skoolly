const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Class = require('../models/class.model');
const nodemailer = require('nodemailer');
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
    bio,
    schoolPhone,
    schoolEmail,
    classId // 🧠 Make sure this comes from frontend if role === 'student'
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    let school = await School.findOne({ name: schoolName });
    let user;

    if (role === 'admin') {
      if (school) {
        return res.status(400).json({ message: 'An admin is already registered for this school.' });
      }

      user = new User({
        fullName,
        email,
        phone,
        password: hashedPassword,
        role,
        gender,
        bio,
        schoolName,
        tenantId: undefined // set later
      });

      user.tenantId = user._id;
      await user.save();

      school = new School({
        name: schoolName,
        address,
        state,
        schoolType,
        phone: schoolPhone,
        email: schoolEmail,
        logo: req.file?.filename || 'default.png',
        createdBy: user._id,
        tenantId: user._id
      });

      await school.save();

      user.school = school._id;
      await user.save();

      const defaultClasses = [];

      if (schoolType.includes('nursery')) {
        defaultClasses.push('KG 1', 'KG 2', 'Nursery 1', 'Nursery 2');
      }
      if (schoolType.includes('primary')) {
        defaultClasses.push('Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6');
      }
      if (schoolType.includes('secondary')) {
        defaultClasses.push('JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3');
      }
      if (schoolType.includes('college')) {
        defaultClasses.push('100 Level', '200 Level', '300 Level', '400 Level');
      }

      // Create the classes
      for (const className of defaultClasses) {
        await Class.create({
          name: className,
          school: school._id,
          tenantId: school.tenantId
        });
      }
    } else {
      if (!school) {
        return res.status(400).json({ message: 'School does not exist. Please contact the admin.' });
      }

      user = new User({
        fullName,
        email,
        phone,
        password: hashedPassword,
        role,
        gender,
        bio,
        schoolName,
        school: school._id,
        tenantId: school.createdBy
      });

      await user.save();

      const profileData = {
        user: user._id,
        fullName,
        email,
        gender,
        bio,
        school: school._id,
        tenantId: school.createdBy,
      };

      if (role === 'student') {
        if (!classId) {
          return res.status(400).json({ message: 'Student must be assigned to a class.' });
        }

        await Student.create({
          ...profileData,
          classId,
        });

      } else if (role === 'teacher') {
        await Teacher.create(profileData);
      }
    }

    const token = generateToken(user);
    res.status(201).json({ user, token, message: 'Verification email sent' });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Optional: check if email is verified before allowing login
    // if (!user.isVerified) {
    //   return res.status(403).json({ message: 'Please verify your email to log in.' });
    // }

    user.password = undefined; // never send password back
    const token = generateToken(user);

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


// exports.checkSchoolAndEmail = async (req, res) => {
//   try {
//     const { email, schoolName } = req.body;

//     const emailExists = await User.exists({ email });
//     const school = await School.findOne({ name: schoolName });

//     const schoolExists = !!school;

//     res.status(200).json({
//       emailExists: !!emailExists,
//       schoolExists,
//       school: schoolExists ? school : null,
//     });
//   } catch (error) {
//     console.error('Error checking school and email:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
exports.checkSchoolAndEmail = async (req, res) => {
  const { email, school } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    const schoolExists = await School.findOne({ name: school });

    return res.status(200).json({
      emailExists: !!emailExists,
      schoolExists: !!schoolExists,
      school: schoolExists || null
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
      from: `"SkooLLy" <no-reply@skoolly.com>`,
      to: email,
      subject: 'Reset Your Password - SkooLLy',
      html: `
        <h2>Forgot your password?</h2>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn’t request this, ignore this email.</p>
      `
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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   const user = await User.findOne({
//     verificationToken: token,
//     verificationTokenExpires: { $gt: new Date() },
//   });

//   if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

//   user.isVerified = true;
//   user.verificationToken = undefined;
//   user.verificationTokenExpires = undefined;

//   await user.save();

//   res.redirect('http://localhost:4200/verified'); // or a nice "Email verified!" frontend page
// };

// exports.resendVerification = async (req, res) => {
//   const user = req.user;

//   if (!user) return res.status(401).json({ message: 'Unauthorized' });

//   if (user.isVerified) {
//     return res.status(400).json({ message: 'User already verified.' });
//   }

//   const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//   const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

//   const html = `
//     <h2>Email Verification</h2>
//     <p>Click the link below to verify your account:</p>
//     <a href="${verificationLink}">${verificationLink}</a>
//   `;

//   await sendEmail({
//     to: user.email,
//     subject: 'Verify your SkooLLy email',
//     html
//   });

//   res.status(200).json({ message: 'Verification email sent again.' });
// };

