import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SalesListPage = () => {
  const [sales, setSales] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sales');
        setSales(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
        Alert.alert('Error', 'Failed to fetch sales.');
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
      Alert.alert('Success', 'Sale deleted successfully!');
    } catch (error) {
      console.error('Error deleting sale:', error);
      Alert.alert('Error', 'Failed to delete sale.');
    }
  };

  const editSale = (id) => {
    navigation.navigate('SalesFormPage', { id }); // Navigate to edit form with sale ID
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.product}</Text>
      <Text style={styles.cell}>{item.quantity} units</Text>
      <Text style={styles.cell}>Ugx {item.costPrice}</Text>
      <Text style={styles.cell}>Ugx {item.sellingPrice}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => editSale(item._id)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteSale(item._id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sales Management System</Text>
      <Text style={styles.date}>{currentDate}</Text>

      <FlatList
        data={sales}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No sales available.</Text>}
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
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: 'gray',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default SalesListPage;
