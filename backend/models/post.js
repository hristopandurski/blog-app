const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, require: true },
  labels: { type: [String], require: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
});

module.exports = mongoose.model('Post', postSchema);