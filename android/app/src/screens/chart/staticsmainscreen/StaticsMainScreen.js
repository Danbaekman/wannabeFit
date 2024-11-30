import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './StaticsMainScreenStyles';

const StaticsMainScreen = () => {
    const navigation = useNavigation();

    return (
      <View style={styles.container}>
        <Text style={styles.header}>WannabeFit</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Volume')}
          >
            <Text style={styles.buttonText}>볼륨</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>종목별 최고 무게</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>총 반복 수</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>총 세트 수</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>운동 횟수</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export default StaticsMainScreen