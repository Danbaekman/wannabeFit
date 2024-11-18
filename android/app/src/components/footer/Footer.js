// Footer.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './FooterStyles';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Record')}>
                <Icon name="clipboard-outline" size={24} color="#000" />
                <Text style={styles.iconText}>기록</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('WorkoutSetup')}>
                <Icon name="barbell-outline" size={24} color="#000" />
                <Text style={styles.iconText}>내 훈련</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Profile')}>
                <Icon name="person-outline" size={24} color="#000" />
                <Text style={styles.iconText}>프로필</Text>
            </TouchableOpacity>
            {/* 차트 아이콘 추가 */}
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Chart')}>
                <Icon name="stats-chart-outline" size={24} color="#000" />
                <Text style={styles.iconText}>통계</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Footer;
