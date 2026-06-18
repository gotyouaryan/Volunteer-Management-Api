const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'volunteer' }, // 'volunteer' or 'admin'
  status: { type: String, default: 'active' }, // 'active' or 'inactive'
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);