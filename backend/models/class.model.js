const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tenantId: { type: String, required: true }
}, {
  timestamps: true
});


module.exports = mongoose.model('Class', classSchema);
