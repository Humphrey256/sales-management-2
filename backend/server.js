const express = require('express');
const mongoose = require('mongoose');
const salesRoutes = require('./routes/salesRoutes');
const dbConnect = require('./config/db');
const cors = require('cors');  // Import CORS
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS
app.use(express.json());

// Database Connection
dbConnect();

// Routes
app.use('/api/sales', salesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
