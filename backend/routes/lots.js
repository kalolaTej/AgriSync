const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const {
  createLot,
  getLots,
  getLotById
} = require('../controllers/lotController');

// memory storage for file buffer processing before uploading to supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
});

const router = express.Router();

// POST endpoint for farmers to create a produce lot with photos
router.post('/lots', authMiddleware, requireRole('farmer'), upload.array('photos', 5), createLot);

// GET endpoints for fetching lots belonging to the authenticated farmer
router.get('/lots', authMiddleware, requireRole('farmer'), getLots);
router.get('/lots/:id', authMiddleware, requireRole('farmer'), getLotById);

module.exports = router;
