const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// Log environment variables (remove in production)
console.log('Environment variables loaded:', {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS ? '****' : undefined,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? '****' : undefined
});

// Import route files
const eventRoutes = require("./Routes/eventRoutes");
const taskRoutes = require('./Routes/taskRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const venueSuggestionRoutes = require('./Routes/venueSuggestionRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/venue-suggestions', venueSuggestionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// MongoDB connection
mongoose
  .connect("mongodb+srv://admin:qdCLshxvlN21D6PJ@cluster1.ppdle.mongodb.net/eventEaseDB?retryWrites=true&w=majority&appName=Cluster1")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
      console.log("API endpoints available at:");
      console.log("- http://localhost:5000/api/bookings");
      console.log("- http://localhost:5000/api/venue-suggestions");
      console.log("- http://localhost:5000/api/events");
      console.log("- http://localhost:5000/api/tasks");
    });
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });
