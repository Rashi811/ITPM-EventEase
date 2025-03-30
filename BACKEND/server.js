const express = require("express");
const mongoose = require("mongoose");
const eventRoutes = require("./Routes/eventRoutes");

const app = express();
const cors = require("cors");
app.use(cors());

const taskRoutes = require('./Routes/taskRoutes');

// Import route files
const bookingRoutes = require('./Routes/bookingRoutes');
const venueSuggestionRoutes = require('./Routes/venueSuggestionRoutes');

// Middleware
app.use(express.json());
app.use("/events", eventRoutes);
app.use('/api/tasks', taskRoutes);

// API Routes
app.use('/api', bookingRoutes);
app.use('/api/venue-suggestions', venueSuggestionRoutes);


mongoose
    .connect("mongodb+srv://admin:qdCLshxvlN21D6PJ@cluster1.ppdle.mongodb.net/eventEaseDB?retryWrites=true&w=majority&appName=Cluster1")
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch((err) => console.log("DB Connection Error: ", err));
