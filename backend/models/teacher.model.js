const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phone: String,
  gender: String,
  bio: String,
  address: String,
  dob: Date,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'teacher',
  },
  subject: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
