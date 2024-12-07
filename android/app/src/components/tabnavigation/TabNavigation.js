import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './TabNavigationStyles';

const TabNavigation = ({ activeTab, onTabPress }) => {
  const tabs = ['운동', '식단', '체중'];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onTabPress(tab)}
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
