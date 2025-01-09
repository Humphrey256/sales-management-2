import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SalesListPage = () => {
  const [sales, setSales] = useState([]);
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
    <div>
      <h1>Sales List</h1>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id}>
              <td>{sale.product}</td>
              <td>{sale.quantity}</td>
              <td>{sale.costPrice}</td>
              <td>{sale.sellingPrice}</td>
              <td>
                <button onClick={() => editSale(sale._id)}>Edit</button>
                <button onClick={() => deleteSale(sale._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesListPage;
