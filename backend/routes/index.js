// Routes Index - Combines and exports all application routes

const express = require('express');
const apiRoutes = require('./api');

const router = express.Router();

// Mount API routes with versioning
router.use('/api/v1', apiRoutes);

// 404 handler for unknown routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    availableEndpoints: [
      'POST /api/v1/calculate'
    ]
  });
});

module.exports = router;
