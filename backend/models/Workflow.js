const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  order: { type: Number, required: true },
  methodFallback: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'] },
  inputMap: { type: mongoose.Schema.Types.Mixed, default: {} }, // map outputs of previous steps to inputs of this step
  condition: { type: String, default: null } // JS-like condition string for execution
});

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  steps: [stepSchema],
  active: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

workflowSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Workflow', workflowSchema);
