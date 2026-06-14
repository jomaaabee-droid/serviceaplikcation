const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  description: String,
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'in_progress', 'done'], default: 'pending' },
  dueDate: Date,
  hoursWorked: { type: Number, default: 0 },
  estimatedHours: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
