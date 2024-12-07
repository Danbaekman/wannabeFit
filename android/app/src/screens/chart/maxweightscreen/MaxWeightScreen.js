import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './MaxWeightScreenStyles';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import CONFIG from '../../../config';

const MaxWeightScreen = () => {
  const [data, setData] = useState(null);

  const fetchMaxWeights = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.API_BASE_URL}/statistic/workout/max-weight`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch max weights');
      const result = await response.json();
      const chartData = {
        labels: result.map((item) => item._id),
        datasets: [{ data: result.map((item) => item.maxWeight) }],
      };
      setData(chartData);
    } catch (error) {
      Alert.alert('Error', '데이터를 가져오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchMaxWeights();
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView>
        {data && (
          <BarChart
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

export default MaxWeightScreen;
