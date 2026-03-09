const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const telemetryService = require('./services/telemetry');
const sensorService = require('./services/sensors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data
  socket.emit('telemetry_update', telemetryService.getTelemetry());
  socket.emit('sensor_update', sensorService.getSensors());

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast updates periodically
setInterval(() => {
  io.emit('telemetry_update', telemetryService.simulateTelemetry());
}, 800);

setInterval(() => {
  io.emit('sensor_update', sensorService.simulateSensors());
}, 5000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AEGIS Server running on http://localhost:${PORT}`);
});
