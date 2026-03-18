const Workflow = require('../models/Workflow');
const Service = require('../models/Service');
const RequestLog = require('../models/RequestLog');
const axios = require('axios');

// @desc    Get all workflows
// @route   GET /api/workflows
// @access  Private
const getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find({ owner: req.user._id }).populate('steps.serviceId');
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a workflow
// @route   POST /api/workflows
// @access  Private
const createWorkflow = async (req, res) => {
  try {
    const { name, description, steps } = req.body;
    const workflow = await Workflow.create({
      name, description, steps, owner: req.user._id
    });
    res.status(201).json(workflow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Execute a workflow (Chain APIs)
// @route   POST /api/workflows/:id/execute
// @access  Private
const executeWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id).populate('steps.serviceId');
    if (!workflow) return res.status(404).json({ message: 'Workflow not found' });

    let context = {}; // Store outputs of each step
    let results = [];

    for (const step of workflow.steps) {
      const service = step.serviceId;
      const startTime = Date.now();
      
      try {
        const config = {
          method: service.method,
          url: service.endpoint,
          headers: service.headers || {},
          data: service.body || {},
          timeout: 5000
        };

        const response = await axios(config);
        const responseTime = Date.now() - startTime;

        context[step.name] = response.data;
        
        const log = {
          serviceId: service._id,
          serviceName: service.name,
          method: service.method,
          endpoint: service.endpoint,
          status: response.status,
          responseTime: responseTime,
          responseData: response.data,
          initiatedBy: req.user._id
        };
        
        await RequestLog.create(log);
        if (req.io) req.io.emit('new_api_log', log);

        results.push({ step: step.name, status: 'success', status_code: response.status });
      } catch (err) {
        results.push({ step: step.name, status: 'failed', error: err.message });
        if (workflow.stopOnError) break; // Optional: stop if one step fails
      }
    }

    res.json({ workflow: workflow.name, summary: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWorkflows, createWorkflow, executeWorkflow };
