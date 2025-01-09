const express = require('express');
const mongoose = require('mongoose');
const salesRoutes = require('./routes/salesRoutes');
const dbConnect = require('./config/db');
const cors = require('cors');
const path = require('path');  // Import path module to work with file paths
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://sales-management-2.onrender.com', 'http://localhost:3000'], // Allow front-end origins
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));  // Enable CORS with the frontend URLs
app.use(express.json());

// Database Connection
dbConnect();

// API Routes
app.use('/api/sales', salesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
