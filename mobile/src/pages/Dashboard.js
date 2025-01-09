import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const Dashboard = ({ navigation }) => {
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
      Alert.alert('Error', 'Failed to fetch sales data');
    }
  };

  const fetchTotalProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit');
      setTotalProfit(response.data.totalProfit);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch total profit');
    }
  };

  const fetchDailyProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit/daily');
      setDailyProfit(response.data.dailyProfit);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch daily profit');
    }
  };

  const fetchMonthlyProfit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/profit/monthly');
      setMonthlyProfit(response.data.monthlyProfit);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch monthly profit');
    }
  };

  const formatCurrency = (amount) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sales Management Dashboard</Text>

      <View style={styles.profitContainer}>
        <Text style={styles.profitText}>Total Profit: {formatCurrency(totalProfit)}</Text>
        <Text style={styles.profitText}>Daily Profit: {formatCurrency(dailyProfit)}</Text>
        <Text style={styles.profitText}>Monthly Profit: {formatCurrency(monthlyProfit)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Sales List</Text>
      <FlatList
        data={sales}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>
              {index + 1}. {item.product} ({item.quantity} units) Profit: {formatCurrency((item.sellingPrice - item.costPrice) * item.quantity)}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('SalesFormPage')}
      >
        <Text style={styles.addButtonText}>Add New Sales</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
    marginBottom: 16,
  },
  profitContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
  },
  profitText: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  listText: {
    fontSize: 14,
  },
  addButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'yellow',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Dashboard;
