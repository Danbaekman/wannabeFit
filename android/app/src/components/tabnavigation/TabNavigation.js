import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './TabNavigationStyles';
import { useNavigation } from '@react-navigation/native';

const TabNavigation = ({ activeTab, onTabPress }) => {
  const navigation = useNavigation();
  const tabs = ['운동', '식단', '체중'];

  const handleTabPress = (tab) => {
    if (tab === '운동') {
      navigation.navigate('StaticsMain');
    } else if (tab === '식단') {
      navigation.navigate('MealStats');
    } else if (tab === '체중') {
      navigation.navigate('WeightStats');
    } else {
      onTabPress(tab);
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
