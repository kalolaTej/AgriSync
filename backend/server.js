const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/market');
const buyerRoutes = require('./routes/buyers');
const logisticsRoutes = require('./routes/logistics');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// api routes
app.use('/api', authRoutes);
app.use('/api', marketRoutes);
app.use('/api', buyerRoutes);
app.use('/api', logisticsRoutes);

// health check endpoints
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AgriSync Market Intelligence Backend API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AgriSync Market Intelligence' });
});

// centralized error handling middleware (must be mounted last)
app.use(errorHandler);

server.listen(port, () => {
  console.log(`AgriSync Market Intelligence server running on port ${port}`);
});

// graceful shutdown handling
const shutdown = (signal) => {
  console.log(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
