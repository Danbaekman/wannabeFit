import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './FooterStyles';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Footer = () => {
    const navigation = useNavigation();
    const selectedDate = useSelector((state) => state.date.selectedDate); // Redux 상태에서 선택된 날짜 읽기

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Record')}>
                <Icon name="clipboard-outline" size={24} color="#000" />
                <Text style={styles.iconText}>기록</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate('WorkoutSetup', { selectedDate })}
            >
                <Icon name="barbell-outline" size={24} color="#000" />
                <Text style={styles.iconText}>내 훈련</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Profile')}>
                <Icon name="person-outline" size={24} color="#000" />
                <Text style={styles.iconText}>프로필</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('StaticsMain')}>
                <Icon name="stats-chart-outline" size={24} color="#000" />
                <Text style={styles.iconText}>통계</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Footer;
