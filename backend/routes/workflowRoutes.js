const express = require('express');
const router = express.Router();
const { getWorkflows, createWorkflow, executeWorkflow } = require('../controllers/workflowController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWorkflows);
router.post('/', protect, createWorkflow);
router.post('/:id/execute', protect, executeWorkflow);

module.exports = router;
