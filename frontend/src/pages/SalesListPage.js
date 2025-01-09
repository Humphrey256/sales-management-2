import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SalesListPage = () => {
  const [sales, setSales] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sales');
        setSales(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    // Get and format current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-UG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);

    fetchSales();
  }, []);

  const deleteSale = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/${id}`);
      setSales(sales.filter((sale) => sale._id !== id)); // Update state after deleting
      alert('Sale deleted successfully!');
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert('Failed to delete sale.');
    }
  };

  const editSale = (id) => {
    navigate(`/SalesFormPage/${id}`); // Navigate to edit form with sale ID
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sales Management System</h1>
      </div>
  
      <div style={styles.content}>
        <h2 style={styles.listTitle}>Sales List</h2>
        <p style={styles.date}>{currentDate}</p>
        {/* Scrollable container for table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Cost Price</th>
                <th style={styles.th}>Selling Price</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} style={styles.tr}>
                  <td style={styles.td}>{sale.product}</td>
                  <td style={styles.td}>{sale.quantity} units</td>
                  <td style={styles.td}>Ugx {sale.costPrice}</td>
                  <td style={styles.td}>Ugx {sale.sellingPrice}</td>
                  <td style={styles.td}>
                    <button onClick={() => editSale(sale._id)} style={styles.editButton}>
                      Edit
                    </button>
                    <button onClick={() => deleteSale(sale._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    margin: '30px auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundColor: 'yellow',
    padding: '10px',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '30px',
    color: 'blue',
    fontWeight: 'bold',
  },
  content: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '0 0 8px 8px',
  },
  listTitle: {
    marginBottom: '10px',
    color: 'blue',
  },
  date: {
    marginBottom: '20px',
    fontSize: '16px',
    color: 'gray',
    fontStyle: 'italic',
  },
  tableContainer: {
    overflowX: 'auto', // Enables horizontal scrolling on small screens
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px', // Ensures table has a minimum width for readability
  },
  th: {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
  },
  tr: {
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ccc',
  },
  editButton: {
    width: '80px', // Fixed width for uniform button sizes
    padding: '5px 10px',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginRight: '10px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  deleteButton: {
    width: '80px', // Same fixed width as edit button
    padding: '5px 10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginLeft: '5px',
    cursor: 'pointer',
    textAlign: 'center',
  },
};

// Responsive media query styles
const responsiveStyleSheet = `
  @media (max-width: 768px) {
    th, td {
      padding: 5px;           /* Reduce padding for smaller screens */
      font-size: 14px;
    }
    button {
      width: 60px;            /* Smaller button width */
      font-size: 12px;
    }
  }
`;

// Adding the responsive styles dynamically to the page
const styleElement = document.createElement('style');
styleElement.innerHTML = responsiveStyleSheet;
document.head.appendChild(styleElement);


export default SalesListPage;
