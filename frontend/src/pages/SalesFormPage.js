import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SalesFormPage = () => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const { id } = useParams(); // Get sale ID from URL if present
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch sale data for editing
      const fetchSale = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/sales/${id}`);
          const { product, quantity, costPrice, sellingPrice } = response.data;
          setProduct(product);
          setQuantity(quantity);
          setCostPrice(costPrice);
          setSellingPrice(sellingPrice);
        } catch (error) {
          console.error('Error fetching sale:', error);
          toast.error("Error fetching sale!");
        }
      };

      fetchSale();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update existing sale
        await axios.put(`http://localhost:5000/api/sales/${id}`, {
          product,
          quantity,
          costPrice,
          sellingPrice,
        });
        toast.success("Sale updated successfully!");
      } else {
        // Add new sale
        await axios.post('http://localhost:5000/api/sales', {
          product,
          quantity,
          costPrice,
          sellingPrice,
        });
        toast.success("Sale added successfully!");
      }
      navigate('/SalesListPage'); // Redirect to sales list page
    } catch (error) {
      console.error('Error saving sale:', error);
      toast.error("Failed to save sale.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Toast Container for showing toast notifications */}
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

      <div>
        <h2 style={styles.formTitle}>{id ? 'Edit Sale' : 'Add New Sale'}</h2>
        <div style={styles.content}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Product</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
              style={styles.input}
            />
            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              style={styles.input}
            />
            <label style={styles.label}>Cost Price</label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              required
              style={styles.input}
            />
            <label style={styles.label}>Selling Price</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              {id ? 'Update Sale' : 'Add Sale'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
    padding: '10px, 10px, 10px',
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
  formTitle: {
    marginBottom: '20px',
    fontSize: '20px',
    color: 'blue',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default SalesFormPage;
