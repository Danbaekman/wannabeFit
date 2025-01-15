import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './NavbarStyles';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.navbar}>
            {/* 중앙 로고 */}
            <Text style={styles.navbarTitle}>Wannabefit</Text>

            {/* 우측 아이콘 */}
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileIcon}>
                <Icon name="person-outline" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

export default Navbar;
