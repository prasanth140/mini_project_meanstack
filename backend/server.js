require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use('/api/', limiter);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Socket.io for Real-time Monitoring
io.on('connection', (socket) => {
  console.log('Client connected to real-time stream', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from stream');
  });
});

// Attach Socket.io to response object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.get('/', (req, res) => {
  res.send('ServiceHub API is running...');
});

// Routes registration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/workflows', require('./routes/workflowRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
});
