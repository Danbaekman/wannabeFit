import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Navbar from '../../../components/navbar/Navbar';
import TabNavigation from '../../../components/tabnavigation/TabNavigation';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';
import styles from './WeightStatsScreenStyles';
import CONFIG from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeightStatsScreen = ({ navigation }) => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);

  useEffect(() => {
    fetchWeightHistory();
  }, []);

  const fetchWeightHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.API_BASE_URL}/statistic/weight/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWeightHistory(data.weightHistory);
      } else {
        console.error('Failed to fetch weight history:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching weight history:', error.message);
    }
  };

  const handleSaveWeight = async () => {
    if (!currentWeight || isNaN(parseFloat(currentWeight))) {
      Alert.alert('오류', '유효한 체중을 입력하세요.');
      return;
    }

    const weightData = { weight: parseFloat(currentWeight) };

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.API_BASE_URL}/statistic/weight/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weightData),
      });

      if (response.ok) {
        Alert.alert('성공', '체중이 성공적으로 저장되었습니다.');
        setCurrentWeight('');
        fetchWeightHistory();
      } else {
        console.error('Failed to save weight:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving weight:', error.message);
    }
  };

  const renderWeightHistory = () => {
    if (!weightHistory || weightHistory.length === 0) {
      return <Text style={styles.noDataText}>체중 기록이 없습니다.</Text>;
    }

    return (
      <ScrollView>
        {weightHistory.map((entry, index) => (
          <View key={index} style={styles.historyRow}>
            <Text style={styles.historyDate}>{new Date(entry.date).toLocaleDateString('ko-KR')}</Text>
            <Text style={styles.historyWeight}>{entry.weight} kg</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="체중" onTabPress={(tab) => navigation.navigate(tab === '운동' ? 'StaticsMain' : 'MealStats')} />

      <ScrollView>
        <ContentWrapper>
          <Text style={styles.sectionTitle}>체중 입력</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={currentWeight}
              onChangeText={(text) => setCurrentWeight(text)}
              placeholder="현재 체중을 입력하세요 (kg)"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveWeight}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>체중 기록</Text>
          <View style={styles.historyContainer}>{renderWeightHistory()}</View>
        </ContentWrapper>
      </ScrollView>
    </View>
  );
};

export default WeightStatsScreen;
