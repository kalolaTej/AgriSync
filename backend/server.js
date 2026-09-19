const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const authRoutes = require('./routes/auth');
const detectionRoutes = require('./routes/detections');
const cameraRoutes = require('./routes/cameras');
const farmRoutes = require('./routes/farms');
const notificationRoutes = require('./routes/notifications');
const settingsRoutes = require('./routes/settings');
const esp32Routes = require('./routes/esp32');
const lotRoutes = require('./routes/lots');
const procurementRoutes = require('./routes/procurement');
const transactionRoutes = require('./routes/transactions');
const matchingRoutes = require('./routes/matching');
const mandiRoutes = require('./routes/mandi');
const saleWindowRoutes = require('./routes/saleWindow');
const incidentRoutes = require('./routes/incidents');
const analyticsRoutes = require('./routes/analytics');
const marketRoutes = require('./routes/market');
const buyerRoutes = require('./routes/buyers');
const logisticsRoutes = require('./routes/logistics');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// initialize socket.io for fallback realtime broadcast
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[socket] client connected: ${socket.id} (total: ${io.sockets.sockets.size})`);
  socket.on('disconnect', () => {
    console.log(`[socket] client disconnected: ${socket.id} (total: ${io.sockets.sockets.size})`);
  });
});

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
app.use('/api', detectionRoutes);
app.use('/api', cameraRoutes);
app.use('/api', farmRoutes);
app.use('/api', notificationRoutes);
app.use('/api', settingsRoutes);
app.use('/api', esp32Routes);
app.use('/api', lotRoutes);
app.use('/api', procurementRoutes);
app.use('/api', transactionRoutes);
app.use('/api', matchingRoutes);
app.use('/api', mandiRoutes);
app.use('/api', saleWindowRoutes);
app.use('/api', incidentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', marketRoutes);
app.use('/api', buyerRoutes);
app.use('/api', logisticsRoutes);

// health check endpoints
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AgriSync Unified Backend API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AgriSync Unified Backend' });
});

// centralized error handling middleware (must be mounted last)
app.use(errorHandler);

server.listen(port, () => {
  console.log(`AgriSync Unified server running on port ${port}`);
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
