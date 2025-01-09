// Mobile Code (React Native)

// mobile/src/App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [sales, setSales] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    fetchSales();
    fetchProfit();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit');
      setTotalProfit(response.data.totalProfit);
    } catch (error) {
      console.error('Error fetching profit:', error);
    }
  }};
