const Service = require('../models/Service');
const RequestLog = require('../models/RequestLog');
const axios = require('axios');

// @desc    Get all services
// @route   GET /api/services
// @access  Private
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate('owner', 'name');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a service
// @route   POST /api/services
// @access  Private
const addService = async (req, res) => {
  try {
    const { name, description, endpoint, method, headers, body, category, environment } = req.body;
    const service = await Service.create({
      name, description, endpoint, method, headers, body, category, environment,
      owner: req.user._id
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    service.isActive = false; // Soft delete
    await service.save();
    res.json({ message: 'Service removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Test an API endpoint
// @route   POST /api/services/test
// @access  Private
const testAPI = async (req, res) => {
  const { url, method, headers, body, serviceId } = req.body;
  const startTime = Date.now();

  try {
    const config = {
      method: method || 'GET',
      url,
      headers: headers || {},
      data: body || {},
      timeout: 10000 // 10s timeout
    };

    const response = await axios(config);
    const responseTime = Date.now() - startTime;

    const logEntry = {
      serviceId: serviceId || null,
      serviceName: url,
      method: method,
      endpoint: url,
      requestHeaders: headers,
      requestBody: body,
      status: response.status,
      responseTime: responseTime,
      responseHeaders: response.headers,
      responseData: response.data,
      initiatedBy: req.user._id
    };

    // If serviceId is provided, we save the log with it
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) logEntry.serviceName = service.name;
      await RequestLog.create(logEntry);
    }

    // Emit live update via Socket.io if available
    if (req.io) {
      req.io.emit('new_api_log', logEntry);
    }

    res.json({
      status: response.status,
      time: responseTime,
      data: response.data,
      headers: response.headers
    });
  } catch (err) {
    const responseTime = Date.now() - startTime;
    const errorLog = {
      serviceId: serviceId || null,
      serviceName: url,
      method: method,
      endpoint: url,
      requestHeaders: headers,
      requestBody: body,
      status: err.response ? err.response.status : 500,
      responseTime: responseTime,
      error: err.message,
      responseData: err.response ? err.response.data : null,
      initiatedBy: req.user._id
    };

    if (serviceId) {
      await RequestLog.create(errorLog);
    }

    if (req.io) {
      req.io.emit('new_api_log', errorLog);
    }

    res.status(err.response ? err.response.status : 500).json({
      status: err.response ? err.response.status : 500,
      time: responseTime,
      error: err.message,
      data: err.response ? err.response.data : null
    });
  }
};

module.exports = { getServices, addService, deleteService, testAPI };
