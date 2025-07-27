const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true
  },
  password: String,
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  gender: String,
  age: Number,
  bio: String,
  phone: String,
  address: String,
  profilePic: String,
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
