const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['First Term', 'Second Term', 'Third Term'],
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  isActive: { type: Boolean, default: false },
  tenantId: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Term', termSchema);
