const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  // Import cors after express
const eventRoutes = require("./Routes/eventRoutes");
const reportRoutes = require("./Routes/reportRoutes");
require('dotenv').config();

// Initialize express app
const app = express(); 

// Log environment variables (remove in production)
console.log('Environment variables loaded:', {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS ? '****' : undefined,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI ? '****' : undefined
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Import route files
const taskRoutes = require('./Routes/taskRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const venueSuggestionRoutes = require('./Routes/venueSuggestionRoutes');

// Use routes
app.use("/events", eventRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/venue-suggestions', venueSuggestionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
});

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
