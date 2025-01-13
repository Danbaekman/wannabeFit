import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        position: 'relative', // 자식 요소의 기준
    },
    navbarTitle: {
        position: 'absolute', // 부모(navbar)의 중앙에 고정
        left: '50%',
        transform: [{ translateX: -50 }], // 가운데 정렬 (숫자로 수정)
        fontSize: 20,
        fontWeight: 'bold',
        color: '#008080',
    },
    profileIcon: {
        marginLeft: 'auto', // 오른쪽으로 정렬
        padding: 8, // 터치 영역 확보
    },
});

export default styles;
