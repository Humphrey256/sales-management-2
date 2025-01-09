import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);

  useEffect(() => {
    fetchSales();
    fetchTotalProfit();
    fetchDailyProfit();
    fetchMonthlyProfit();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchTotalProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit');
      setTotalProfit(response.data.totalProfit);
    } catch (error) {
      console.error('Error fetching total profit:', error);
    }
  };

  const fetchDailyProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit/daily');
      setDailyProfit(response.data.dailyProfit);
    } catch (error) {
      console.error('Error fetching daily profit:', error);
    }
  };

  const fetchMonthlyProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit/monthly');
      setMonthlyProfit(response.data.monthlyProfit);
    } catch (error) {
      console.error('Error fetching monthly profit:', error);
    }
  };

  const formatCurrency = (amount) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Sales Management System</h1>
      </div>

      <div style={styles.content}>
        <h2 style={styles.dashboardTitle}>Dashboard</h2>
        <h3>Total Profit: {formatCurrency(totalProfit)}</h3>
        <h3>Daily Profit: {formatCurrency(dailyProfit)}</h3>
        <h3>Monthly Profit: {formatCurrency(monthlyProfit)}</h3>

        <div style={styles.container}>
          <div style={styles.salesList}>
            <h3>Sales List</h3>
            <ul style={styles.list}>
              {sales.map((sale, index) => (
                <li key={sale._id} style={styles.listItem}>
                  {index + 1}. {sale.product} ({sale.quantity} units) Profit: {formatCurrency((sale.sellingPrice - sale.costPrice) * sale.quantity)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link to="/SalesFormPage" style={styles.addButton}>
          Add New Sales
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
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  listItem: {
    marginBottom: '10px',
  },
  addButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'yellow',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
};

export default Dashboard;
