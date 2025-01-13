import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    footerContainer: { 
        bottom: 0,             
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
        flex: 1, // 각 아이콘의 터치 영역을 균등하게 분배
        justifyContent: 'center',
        borderRightWidth: 1, // 세로 막대기 추가
        borderColor: '#ccc', // 막대기 색상
    },
    // 마지막 아이콘은 막대기가 없도록 조정
    lastIconContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    iconText: {
        marginTop: 4,
        fontSize: 12,
        color: '#000',
    },
});

export default styles;
