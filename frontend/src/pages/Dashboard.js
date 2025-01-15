import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [topSoldProduct, setTopSoldProduct] = useState(null);
  const [secondSoldProduct, setSecondSoldProduct] = useState(null);
  const [leastSoldProduct, setLeastSoldProduct] = useState(null);

  useEffect(() => {
    fetchSales();
    fetchDailyProfit();
    fetchMonthlyProfit();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('https://sales-management-2.onrender.com/api/sales');
      setSales(response.data);
      
      // Calculate the cumulative total profit here
      const cumulativeProfit = response.data.reduce((acc, sale) => {
        return acc + (sale.sellingPrice - sale.costPrice) * sale.quantity;
      }, 0);
      setTotalProfit(cumulativeProfit);
      
      // Calculate the most sold, second most sold, and least sold products
      calculateTopProducts(response.data);
      
      toast.success("Sales data fetched and total profit calculated!");
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error("Error fetching sales!");
    }
  };

  const fetchDailyProfit = async () => {
    try {
      const response = await axios.get('https://sales-management-2.onrender.com/api/sales/profit/daily');
      setDailyProfit(response.data.dailyProfit);
      toast.success("Daily profit fetched successfully!");
    } catch (error) {
      console.error('Error fetching daily profit:', error);
      toast.error("Error fetching daily profit!");
    }
  };

  const fetchMonthlyProfit = async () => {
    try {
      const response = await axios.get('https://sales-management-2.onrender.com/api/sales/profit/monthly');
      setMonthlyProfit(response.data.monthlyProfit);
      toast.success("Monthly profit fetched successfully!");
    } catch (error) {
      console.error('Error fetching monthly profit:', error);
      toast.error("Error fetching monthly profit!");
    }
  };

  const calculateTopProducts = (salesData) => {
    const productSales = {};

    salesData.forEach((sale) => {
      if (!productSales[sale.product]) {
        productSales[sale.product] = { totalQuantity: 0, totalProfit: 0 };
      }
      productSales[sale.product].totalQuantity += sale.quantity;
      productSales[sale.product].totalProfit += (sale.sellingPrice - sale.costPrice) * sale.quantity;
    });

    // Sort products by quantity sold (descending)
    const sortedProducts = Object.entries(productSales)
      .map(([product, data]) => ({ product, ...data }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);

    // Get the top 3 products: most sold, second most sold, least sold
    setTopSoldProduct(sortedProducts[0]);
    setSecondSoldProduct(sortedProducts[1]);
    setLeastSoldProduct(sortedProducts[sortedProducts.length - 1]);
  };

  const formatCurrency = (amount) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  return (
    <div>
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      
      <div style={styles.header}>
        <h1 style={styles.title}>Sales Management System</h1>
      </div>

      <div style={styles.content}>
        <h2 style={styles.dashboardTitle}>Dashboard</h2>
        <h3>Cummulative Profit: {formatCurrency(totalProfit)}</h3>
        <h3>Daily Profit: {formatCurrency(dailyProfit)}</h3>
        <h3>Monthly Profit: {formatCurrency(monthlyProfit)}</h3>

        <div style={styles.container}>
          <div style={styles.salesList}>
            <h3>Sales List</h3>
            <div style={styles.salesListContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Profit</th>
                    <th>Total Profit</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale._id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{sale.product}</td>
                      <td style={styles.tableCell}>{sale.quantity}</td>
                      <td style={styles.tableCell}>{formatCurrency(sale.sellingPrice - sale.costPrice)}</td>
                      <td style={styles.tableCell}>{formatCurrency((sale.sellingPrice - sale.costPrice) * sale.quantity)}</td>
                      <td style={styles.tableCell}>{new Date(sale.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Top Sold, Second Sold, and Least Sold Products Section */}
          {topSoldProduct && (
            <div style={styles.productInfo}>
              <h4>Most Sold Product: {topSoldProduct.product}</h4>
              <p>Quantity Sold: {topSoldProduct.totalQuantity}</p>
              <p>Total Profit: {formatCurrency(topSoldProduct.totalProfit)}</p>
            </div>
          )}

          {secondSoldProduct && (
            <div style={styles.productInfo}>
              <h4>Second Most Sold Product: {secondSoldProduct.product}</h4>
              <p>Quantity Sold: {secondSoldProduct.totalQuantity}</p>
              <p>Total Profit: {formatCurrency(secondSoldProduct.totalProfit)}</p>
            </div>
          )}

          {leastSoldProduct && (
            <div style={styles.productInfo}>
              <h4>Least Sold Product: {leastSoldProduct.product}</h4>
              <p>Quantity Sold: {leastSoldProduct.totalQuantity}</p>
              <p>Total Profit: {formatCurrency(leastSoldProduct.totalProfit)}</p>
            </div>
          )}

        </div>

        <Link to="/SalesFormPage" style={styles.addButton}>
          Add New Sales
        </Link>

        <Link to="/SalesListPage" style={styles.salesListButton}>
          View Sales List
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
    padding: '10px',
    borderRadius: '8px',
    width: '100%',
    margin: '30px auto',
    boxShadow: '0 4px 8px rgba(22, 16, 16, 0.1)',
  },
  header: {
    backgroundColor: 'yellow',
    padding: '10px',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '40px',
    color: 'blue',
    fontWeight: 'bold',
  },
  content: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '0 0 8px 8px',
  },
  dashboardTitle: {
    marginBottom: '2px',
    fontSize: '24px',
    color: 'blue',
  },
  salesList: {
    marginBottom: '20px',
    fontSize: '20px',
    color: 'blue',
  },
  // Make the sales table horizontally scrollable
  salesListContainer: {
    overflowX: 'auto',  // Enable horizontal scroll
    marginTop: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'center',
    fontSize: '16px',
  },
  addButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    marginTop: '10px',
    marginLeft: '10px',
  },
  salesListButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    marginTop: '10px',
    marginLeft: '10px',
  },

  productInfo: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(22, 16, 16, 0.1)',
    color: 'blue',  // This makes the text blue
  },
};

export default Dashboard;
