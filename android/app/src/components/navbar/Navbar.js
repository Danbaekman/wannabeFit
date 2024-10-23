import React from 'react'
import styles from './NavbarStyles';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const Navbar = () => {
    
  return (
    <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Wannabe Fit</Text>
    </View>
  )
}

export default Navbar