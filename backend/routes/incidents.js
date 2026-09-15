const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// POST /api/incidents
// Allowed: farmer, procurement_operator, admin
router.post('/incidents', authMiddleware, requireRole(['farmer', 'procurement_operator', 'admin']), incidentController.createIncident);

// GET /api/incidents/:lot_id
// Allowed: farmer, procurement_operator, admin
router.get('/incidents/:lot_id', authMiddleware, requireRole(['farmer', 'procurement_operator', 'admin']), incidentController.getIncidentsByLot);

// PATCH /api/incidents/:id
// Allowed: procurement_operator, admin
router.patch('/incidents/:id', authMiddleware, requireRole(['procurement_operator', 'admin']), incidentController.updateIncident);

module.exports = router;
