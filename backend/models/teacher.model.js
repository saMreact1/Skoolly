const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  // Add more fields as needed
});

module.exports = mongoose.model('Teacher', teacherSchema);
