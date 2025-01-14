const express = require('express');
const mongoose = require('mongoose');
const salesRoutes = require('./routes/salesRoutes');
const dbConnect = require('./config/db');
const cors = require('cors');
const path = require('path'); // Import path module to work with file paths
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://sales-management-2-1.onrender.com','http://localhost:3000'], // Allow front-end origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // Enable CORS with the frontend URLs
app.use(express.json());

// Database Connection
dbConnect();

// Basic route to verify the server is up
app.get('/api', (req, res) => {
  res.send('Backend API is running');
});

// API Routes
app.use('/api/sales', salesRoutes);

// Serve React App's static files from the 'build' folder
app.use(express.static(path.join(__dirname, 'build')));

// Fallback route to serve index.html for React Router on any non-API request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
