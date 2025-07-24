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
  address: String,
  bio: String,
  profilePic: String,

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
