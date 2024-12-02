const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Or Date, depending on how you want to store time
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true } // Reference to Doctor model
});

module.exports = mongoose.model('Appointment', appointmentSchema);
    