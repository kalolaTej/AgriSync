/**
 * AgriSync - Market Intelligence Routes
 * Owner: Tej
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const marketController = require('../controllers/marketController');

// Mandi Prices, Trend & Arbitrage Endpoints
router.get('/prices', marketController.getPrices);
router.get('/prices/trend', marketController.getTrend);
router.get('/prices/arbitrage', marketController.getArbitrage);

// Sale-Window Recommendation & Interactive Simulation
router.get('/lots/:id/sale-window', authMiddleware, marketController.getSaleWindow);
router.post('/sale-window/simulate', marketController.simulateSaleWindow);

module.exports = router;
