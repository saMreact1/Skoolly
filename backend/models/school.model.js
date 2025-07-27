const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  logo: String,
  schoolEmail: String,
  schoolPhone: String,
  address: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  schoolType: {
    type: [String], // e.g. ["nursery", "primary"]
    enum: ['nursery', 'primary', 'secondary', 'college'],
    required: true
  },
  tenantId: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


module.exports = mongoose.model('School', schoolSchema);
