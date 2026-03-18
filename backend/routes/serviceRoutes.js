const express = require('express');
const router = express.Router();
const { getServices, addService, deleteService, testAPI } = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getServices);
router.post('/', protect, addService);
router.delete('/:id', protect, admin, deleteService);
router.post('/test', protect, testAPI);

module.exports = router;
