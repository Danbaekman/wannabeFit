import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './TabNavigationStyles';

const TabNavigation = ({ activeTab, onTabPress, navigation }) => {
  const tabs = ['운동', '식단', '체중'];

  const handleTabPress = (tab) => {
    if (tab === '식단') {
      navigation.navigate('MealStats'); // MealStatsScreen으로 이동
    } else {
      onTabPress(tab); // 다른 탭은 기존의 onTabPress 호출
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
