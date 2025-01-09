// src/components/SalesForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SalesForm = ({ fetchSales, fetchProfit }) => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!product || quantity <= 0 || costPrice <= 0 || sellingPrice <= 0) {
      setError('All fields are required and must have valid values.');
      return;
    }
    setError('');

    try {
      const newSale = { product, quantity, costPrice, sellingPrice };
      await axios.post('/api/sales', newSale);

      // Fetch updated sales and profit after adding a new sale
      fetchSales();
      fetchProfit();

      // Clear form fields
      setProduct('');
      setQuantity(0);
      setCostPrice(0);
      setSellingPrice(0);
    } catch (error) {
      console.error('Error adding sale:', error);
      setError('Failed to add sale. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Add New Sale</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="Cost Price"
          value={costPrice}
          onChange={(e) => setCostPrice(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="Selling Price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(Number(e.target.value))}
          required
        />
        <button type="submit">Add Sale</button>
      </form>
    </div>
  );
};

export default SalesForm;
