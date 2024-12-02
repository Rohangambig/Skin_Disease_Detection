const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  disease: String,
  medicine_name: String,
  quantity: Number,
  description: String,
  photo:String,
  rating:Number,
});

module.exports = mongoose.model('Medicines', medicineSchema);