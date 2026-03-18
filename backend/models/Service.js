const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  endpoint: { type: String, required: true },
  method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
  headers: { type: Map, of: String, default: {} },
  body: { type: mongoose.Schema.Types.Mixed, default: {} },
  category: { type: String, enum: ['internal', 'external'], default: 'external' },
  environment: { type: String, enum: ['dev', 'staging', 'production'], default: 'dev' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
