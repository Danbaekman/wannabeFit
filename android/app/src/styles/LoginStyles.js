import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 30,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#ffffff',
    },

    backButton: {
      alignSelf: 'flex-start',
      fontSize: 16,
      marginBottom: 20,
      color: '#008080',
      paddingTop: 20,
      fontWeight: 'bold',
    },

    welcomeText: {
      alignSelf: 'flex-start',
      fontSize: 25,
      fontWeight: 'bold',
      color: '#008080',
    },
    header: {
      alignSelf: 'flex-start',
      fontSize: 40,
      color: '#000000',
      fontWeight: 'bold',
      marginBottom: 20,
    },
    description: {
      alignSelf: 'flex-start',
      textAlign: 'left',
      fontSize: 15,
      color: '#888',
      marginBottom: 40,
    },
    LogoImageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#ffffff',
      marginBottom: 30,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 80,
    },
    LogoImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    LogoText: {
      textAlign: 'center',
      fontSize: 30,
      color: '#008080',
      fontWeight: 'bold',
      paddingTop: 10,
      paddingBottom: 80,
    },
    kakaoButton: {
      backgroundColor: '#FEE500',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,  // 버튼 높이 설정
      paddingHorizontal: 40, // 버튼 너비 설정
      borderRadius: 10,
      marginBottom: 15,
      justifyContent: 'center',
    },
    kakaoSymbol: {
      width: 30,  // 심볼 크기
      height: 30,
      marginRight: 10, // 심볼과 텍스트 간격 설정
    },
    kakaoButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    kakaoText: {
      fontSize: 18,  // 글씨 크기
      fontWeight: 'bold',
      color: '#3A1D1D',
      textAlign: 'center',
    },
    naverButton: {
      backgroundColor: '#03C75A',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,  // 버튼 높이 설정
      paddingHorizontal: 40, // 버튼 너비 설정
      borderRadius: 10,
      justifyContent: 'center',
    },
    naverSymbol: {
      width: 30,  // 심볼 크기
      height: 30,
      marginRight: 10, // 심볼과 텍스트 간격 설정
    },
    naverText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },
});

export default styles;
