import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // 전체 정렬을 중앙에 맞춤
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        position: 'relative',
    },
    navbarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#008080',
        textAlign: 'center',
    },
    profileIcon: {
        position: 'absolute', // 우측으로 이동
        right: 15, // 오른쪽 여백
        padding: 8, // 터치 영역 확보
    },
});

export default styles;
