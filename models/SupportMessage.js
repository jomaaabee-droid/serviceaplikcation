const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  content: { type: String, required: true },
  reply: { type: String, default: null },
  repliedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportMessage', supportSchema);
