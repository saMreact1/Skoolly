const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'admin'
  },
  school: {
    name: String,
    address: String,
    state: String,
    schoolType: [String],
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  address: String,
  bio: String,
  profilePic: String,
  resetToken: String,
  resetTokenExpiry: Date,

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
