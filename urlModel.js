const mongoose = require('mongoose');

// Schema for shape of documents
const UrlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
});

// Create new model 
module.exports = mongoose.model('Links', UrlSchema);