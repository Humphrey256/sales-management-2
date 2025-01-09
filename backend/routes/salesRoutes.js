const express = require('express');
const {
  addSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  calculateProfit,
  calculateDailyProfit,
  calculateMonthlyProfit,
} = require('../controllers/salesController');

const router = express.Router();

// Routes
router.post('/', addSale);  // Add a new sale
router.get('/', getSales);  // Get all sales
router.get('/:id', getSaleById);  // Get a single sale by ID
router.put('/:id', updateSale);  // Update a sale by ID
router.delete('/:id', deleteSale);  // Delete a sale by ID
router.get('/profit', calculateProfit);  // Calculate total profit
router.get('/profit/daily', calculateDailyProfit);  // Calculate daily profit
router.get('/profit/monthly', calculateMonthlyProfit);  // Calculate monthly profit

module.exports = router;
