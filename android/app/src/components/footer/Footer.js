import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons로 변경
import styles from './FooterStyles';


const Footer = ({ navigation }) => {
    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Record')}>
                <Icon name="clipboard-outline" size={24} color="#000" />
                <Text style={styles.iconText}>기록</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Training')}>
                <Icon name="barbell-outline" size={24} color="#000" />
                <Text style={styles.iconText}>내 훈련</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Profile')}>
                <Icon name="person-outline" size={24} color="#000" />
                <Text style={styles.iconText}>프로필</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Footer;
