import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    footerContainer: { // 화면의 가장 아래에 고정
        bottom: 0,             // 여백 없이 가장 아래에 배치
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    iconContainer: {
        alignItems: 'center',
    },
    iconText: {
        marginTop: 4,
        fontSize: 12,
        color: '#000',
    },
});

export default styles;
