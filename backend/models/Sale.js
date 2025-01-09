// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  profit: { type: Number, required: true },  // Store the profit from each sale
  date: { type: Date, default: Date.now },  // Date of sale
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create and export the Sale model
module.exports = mongoose.model('Sale', saleSchema);
