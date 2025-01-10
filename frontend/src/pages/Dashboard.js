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

  useEffect(() => {
    fetchSales();
    fetchDailyProfit();
    fetchMonthlyProfit();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      setSales(response.data);
      // Calculate the cumulative total profit here
      const cumulativeProfit = response.data.reduce((acc, sale) => {
        return acc + (sale.sellingPrice - sale.costPrice) * sale.quantity;
      }, 0);
      setTotalProfit(cumulativeProfit);
      toast.success("Sales data fetched and total profit calculated!");
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error("Error fetching sales!");
    }
  };

  const fetchDailyProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit/daily');
      setDailyProfit(response.data.dailyProfit);
      toast.success("Daily profit fetched successfully!");
    } catch (error) {
      console.error('Error fetching daily profit:', error);
      toast.error("Error fetching daily profit!");
    }
  };

  const fetchMonthlyProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit/monthly');
      setMonthlyProfit(response.data.monthlyProfit);
      toast.success("Monthly profit fetched successfully!");
    } catch (error) {
      console.error('Error fetching monthly profit:', error);
      toast.error("Error fetching monthly profit!");
    }
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
  // Media Queries for responsiveness
  '@media (max-width: 768px)': {
    title: {
      fontSize: '28px',
    },
    dashboardTitle: {
      fontSize: '18px',
    },
    salesList: {
      fontSize: '16px', // Slightly smaller for tablet-sized screens
    },
    tableCell: {
      fontSize: '14px',
      padding: '8px',
    },
    table: {
      fontSize: '14px',
    },
    addButton: {
      padding: '8px 16px',
    },
    salesListButton: {
      padding: '8px 16px',
    },
  },
  '@media (max-width: 480px)': {
    container: {
      padding: '8px',
    },
    table: {
      fontSize: '12px', // Smaller font for mobile
    },
    tableCell: {
      padding: '6px',
    },
    title: {
      fontSize: '24px',
    },
    dashboardTitle: {
      fontSize: '16px',
    },
    addButton: {
      padding: '6px 12px',
    },
    salesListButton: {
      padding: '6px 12px',
    },
  },
};

export default Dashboard;
