const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  teacher: { type: String, required: true },
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
