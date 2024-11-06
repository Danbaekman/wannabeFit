// ChartScreenStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333'
    },
    chart: {
        borderRadius: 16,
        marginVertical: 20
    },
    chartDescription: {
        textAlign: 'center',
        color: '#666',
        marginTop: 10,
        fontSize: 14
    }
});

export default styles;
