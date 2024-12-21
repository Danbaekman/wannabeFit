import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const NutrientPieChart = ({ nutrients }) => {
  const data = [
    {
      name: '탄수화물',
      amount: nutrients.carbohydrates,
      color: 'green',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '단백질',
      amount: nutrients.protein,
      color: 'blue',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '지방',
      amount: nutrients.fat,
      color: 'yellow',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  // 데이터가 없는 경우 빈 배열 반환
  const validData = data.filter((item) => item.amount > 0);

  return (
    <View style={styles.chartContainer}>
      <PieChart
        data={validData}
        width={screenWidth - 40} // 차트 너비
        height={220} // 차트 높이
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={'amount'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default NutrientPieChart;
