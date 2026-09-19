const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createIncident,
  getIncidents,
  getIncidentAnalytics,
} = require('../controllers/incidentController');

const router = express.Router();

router.post('/incidents', authMiddleware, createIncident);
router.get('/incidents', authMiddleware, getIncidents);
router.get('/incidents/analytics', authMiddleware, getIncidentAnalytics);

module.exports = router;
