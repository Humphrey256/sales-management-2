const Sale = require('../models/Sale');
const moment = require('moment');  // To help with date manipulation

// Add a new sale
const addSale = async (req, res) => {
  const { product, quantity, costPrice, sellingPrice } = req.body;
  try {
    // Calculate profit for the sale
    const profit = (sellingPrice - costPrice) * quantity;

    const newSale = new Sale({
      product,
      quantity,
      costPrice,
      sellingPrice,
      profit,  // Include the calculated profit
    });

    // Save the new sale to the database
    await newSale.save();

    res.status(201).json({
      message: 'Sale added successfully',
      sale: newSale,
      profit: profit,  // Return the calculated profit
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add sale', error: error.message });
  }
};

// Get all sales
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
  }
};

// Get a single sale by ID
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sale', error: error.message });
  }
};

// Update a sale by ID
const updateSale = async (req, res) => {
  const { product, quantity, costPrice, sellingPrice } = req.body;
  try {
    // Calculate updated profit
    const profit = (sellingPrice - costPrice) * quantity;

    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { product, quantity, costPrice, sellingPrice, profit },
      { new: true, runValidators: true }
    );

    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    res.status(200).json({ message: 'Sale updated successfully', sale });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update sale', error: error.message });
  }
};

// Delete a sale by ID
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sale', error: error.message });
  }
};
// Calculate daily profit for today
const calculateDailyProfit = async (req, res) => {
  try {
    const todayStart = moment().startOf('day');   // Get the start of today
    const todayEnd = moment().endOf('day');       // Get the end of today

    // Fetch sales for today
    const sales = await Sale.find({
      createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
    });

    if (!sales || sales.length === 0) {
      return res.status(200).json({ dailyProfit: 0, message: 'No sales recorded for today' });
    }

    // Calculate total profit for today's sales
    const dailyProfit = sales.reduce(
      (acc, sale) => acc + (sale.sellingPrice - sale.costPrice) * sale.quantity,
      0
    );

    res.status(200).json({ dailyProfit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate daily profit', error: error.message });
  }
};

// Calculate cumulative profit
const calculateCumulativeProfit = async (req, res) => {
  try {
    // Retrieve all sales from the database
    const sales = await Sale.find();

    if (!sales || sales.length === 0) {
      return res.status(200).json({ cumulativeProfit: 0 });
    }

    // Calculate cumulative profit
    const cumulativeProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);

    res.status(200).json({ cumulativeProfit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate cumulative profit', error: error.message });
  }
};

// Calculate monthly profit (for completed months only)
const calculateMonthlyProfit = async (req, res) => {
  try {
    // Get the start of the current month
    const startOfCurrentMonth = moment().startOf('month').toDate();
    
    // Get the start of the previous month
    const startOfPreviousMonth = moment().subtract(1, 'month').startOf('month').toDate();
    
    // Get the end of the previous month
    const endOfPreviousMonth = moment().subtract(1, 'month').endOf('month').toDate();

    // Fetch sales made in the previous month
    const sales = await Sale.find({
      createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth }
    });

    // Calculate profit for the previous month
    const monthlyProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);

    res.status(200).json({ monthlyProfit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate monthly profit', error: error.message });
  }
};

module.exports = { 
  addSale, 
  getSales, 
  getSaleById, 
  updateSale, 
  deleteSale, 
  calculateCumulativeProfit,
  calculateDailyProfit,
  calculateMonthlyProfit,
};
