const express = require('express');
const router = express.Router();
const { getLogs, getStats, exportLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getLogs);
router.get('/stats', protect, getStats);
router.get('/export', protect, exportLogs);

module.exports = router;
