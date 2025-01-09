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

// Calculate total profit
const calculateProfit = async (req, res) => {
  try {
    // Retrieve all sales from the database
    const sales = await Sale.find();
    
    // Log sales data to ensure we are retrieving the expected data
    console.log('Sales:', sales);

    // If there are no sales, return a profit of 0
    if (!sales || sales.length === 0) {
      console.log('No sales found. Total profit is 0.');
      return res.status(200).json({ totalProfit: 0 });
    }

    // Calculate the total profit from all sales
    const totalProfit = sales.reduce(
      (acc, sale) => acc + (sale.sellingPrice - sale.costPrice) * sale.quantity,
      0
    );
    
    // Log the total profit for debugging purposes
    console.log('Total Profit:', totalProfit);

    // Send the total profit as a response
    res.status(200).json({ totalProfit });
  } catch (error) {
    // Log any error encountered
    console.error('Error calculating profit:', error);
    
    // Send an error response
    res.status(500).json({ message: 'Failed to calculate profit', error: error.message });
  }
};

// Calculate daily profit
const calculateDailyProfit = async (req, res) => {
  try {
    const today = moment().startOf('day');  // Get the start of today
    const sales = await Sale.find({
      createdAt: { $gte: today.toDate() },  // Get sales from today onwards
    });

    const dailyProfit = sales.reduce(
      (acc, sale) => acc + sale.profit,
      0
    );

    res.status(200).json({ dailyProfit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate daily profit', error: error.message });
  }
};

// Calculate Monthly Profit (Last 30 Days)
const calculateMonthlyProfit = async (req, res) => {
  try {
    // Get the current date and calculate the date 30 days ago
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();

    // Fetch sales made in the last 30 days
    const sales = await Sale.find({
      date: { $gte: thirtyDaysAgo }  // Filter sales made after the calculated date
    });

    // Calculate profit for the filtered sales
    const monthlyProfit = sales.reduce(
      (acc, sale) => acc + (sale.sellingPrice - sale.costPrice) * sale.quantity,
      0
    );

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
  calculateProfit,
  calculateDailyProfit,
  calculateMonthlyProfit,
};
