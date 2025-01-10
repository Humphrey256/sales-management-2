const express = require('express');
const {
  addSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  calculateCumulativeProfit,  // Updated function for cumulative profit
  calculateDailyProfit,
  calculateMonthlyProfit,      // Revised monthly profit function
} = require('../controllers/salesController');

const router = express.Router();

// Routes
router.post('/', addSale);                    // Add a new sale
router.get('/', getSales);                    // Get all sales
router.get('/:id', getSaleById);              // Get a single sale by ID
router.put('/:id', updateSale);               // Update a sale by ID
router.delete('/:id', deleteSale);            // Delete a sale by ID
router.get('/profit/cumulative', calculateCumulativeProfit);  // Calculate cumulative profit
router.get('/profit/daily', calculateDailyProfit);            // Calculate daily profit
router.get('/profit/monthly', calculateMonthlyProfit);        // Calculate monthly profit

module.exports = router;
