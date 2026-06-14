const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  stripeCustomerId: String,
  subscriptionId: String,
  subscriptionActive: { type: Boolean, default: false },
  subscriptionEnd: Date,
  paymentPending: { type: Boolean, default: false },
  logo: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);
