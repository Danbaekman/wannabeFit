import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './TabNavigationStyles';
import { useNavigation } from '@react-navigation/native';

const TabNavigation = ({ activeTab, onTabPress }) => {
  const navigation = useNavigation(); // useNavigation으로 navigation 객체 가져오기
  const tabs = ['운동', '식단', '체중'];

  const handleTabPress = (tab) => {
    if (tab === '운동') {
      navigation.navigate('StaticsMain'); // 운동 화면으로 이동
    } else if (tab === '식단') {
      navigation.navigate('MealStats'); // 식단 화면으로 이동
    } else if (tab === '체중') {
      navigation.navigate('WeightStats'); // 체중 화면으로 이동 (WeightStatsScreen 가정)
    } else {
      onTabPress(tab); // 다른 탭 클릭 시 추가 동작
    }
  };

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleTabPress(tab)}
          style={activeTab === tab ? styles.tabButtonActive : styles.tabButton}
        >
          <Text style={activeTab === tab ? styles.tabButtonTextActive : styles.tabButtonText}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabNavigation;
