import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit'; // Chart 라이브러리 사용
import { Dimensions } from 'react-native';
import styles from './VolumeScreenStyles';

const screenWidth = Dimensions.get('window').width;

const VolumeScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('3개월');
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [5000, 7000, 8000, 6000],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>볼륨</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedPeriod === '1주' && styles.activeFilter,
          ]}
          onPress={() => setSelectedPeriod('1주')}
        >
          <Text style={styles.filterText}>1주</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedPeriod === '1개월' && styles.activeFilter,
          ]}
          onPress={() => setSelectedPeriod('1개월')}
        >
          <Text style={styles.filterText}>1개월</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedPeriod === '3개월' && styles.activeFilter,
          ]}
          onPress={() => setSelectedPeriod('3개월')}
        >
          <Text style={styles.filterText}>3개월</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedPeriod === '6개월' && styles.activeFilter,
          ]}
          onPress={() => setSelectedPeriod('6개월')}
        >
          <Text style={styles.filterText}>6개월</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>총 볼륨: 26,000kg</Text>
          <Text style={styles.summaryText}>평균 볼륨: 6,500kg/주</Text>
        </View>
      </ScrollView>
    </View>
  );
};


export default VolumeScreen;
