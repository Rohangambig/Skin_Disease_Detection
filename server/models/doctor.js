const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // specialization: { type: String, required: true },
  // clinic: { type: String, required: true },
  // location: { type: String, required: true },
  // ratings: { type: Number, required: true, default: 0 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // photo: { type: String, required: true },
  // available: { type: Boolean, default: true }
});


module.exports = mongoose.model('Doctors', doctorSchema);
