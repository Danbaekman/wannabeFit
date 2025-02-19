const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  weight: { type: Number, required: true },
});

module.exports = mongoose.model('Weight', weightSchema);
