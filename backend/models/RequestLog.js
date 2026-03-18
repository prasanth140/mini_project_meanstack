const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true },
  method: { type: String, required: true },
  endpoint: { type: String, required: true },
  requestHeaders: { type: Map, of: String },
  requestBody: { type: mongoose.Schema.Types.Mixed },
  status: { type: Number, required: true }, // HTTP status code
  responseTime: { type: Number, required: true }, // in ms
  responseHeaders: { type: Map, of: String },
  responseData: { type: mongoose.Schema.Types.Mixed },
  error: { type: String },
  timestamp: { type: Date, default: Date.now },
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Middleware to emit data via Socket.io when log is saved.
// In actual implementation, we might use server.js directly, but this records correctly for real-time dashboard integration via controller.
module.exports = mongoose.model('RequestLog', requestLogSchema);
