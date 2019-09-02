const mongoose = require('mongoose');

const statsSchema = mongoose.Schema({
  date: { type: Number, required: true },
  user: { type: String, required: true },
  entries: { type: Number, required: true },
});

module.exports = mongoose.model('Stats', statsSchema);