import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const SalesFormPage = ({ route, navigation }) => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const { id } = route.params || {}; // Get sale ID from navigation params if present

  useEffect(() => {
    if (id) {
      // Fetch sale data for editing
      const fetchSale = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/sales/${id}`);
          const { product, quantity, costPrice, sellingPrice } = response.data;
          setProduct(product);
          setQuantity(quantity.toString());
          setCostPrice(costPrice.toString());
          setSellingPrice(sellingPrice.toString());
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch sale details.');
        }
      };

      fetchSale();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!product || !quantity || !costPrice || !sellingPrice) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      if (id) {
        // Update existing sale
        await axios.put(`http://localhost:5000/api/sales/${id}`, {
          product,
          quantity: Number(quantity),
          costPrice: Number(costPrice),
          sellingPrice: Number(sellingPrice),
        });
        Alert.alert('Success', 'Sale updated successfully!');
      } else {
        // Add new sale
        await axios.post('http://localhost:5000/api/sales', {
          product,
          quantity: Number(quantity),
          costPrice: Number(costPrice),
          sellingPrice: Number(sellingPrice),
        });
        Alert.alert('Success', 'Sale added successfully!');
      }
      navigation.navigate('SalesListPage'); // Redirect to sales list page
    } catch (error) {
      console.error('Error saving sale:', error);
      Alert.alert('Error', 'Failed to save sale.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{id ? 'Edit Sale' : 'Add New Sale'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Product"
        value={product}
        onChangeText={setProduct}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cost Price"
        value={costPrice}
        onChangeText={setCostPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Selling Price"
        value={sellingPrice}
        onChangeText={setSellingPrice}
        keyboardType="numeric"
      />

      <Button
        title={id ? 'Update Sale' : 'Add Sale'}
        onPress={handleSubmit}
        color="yellow"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default SalesFormPage;
