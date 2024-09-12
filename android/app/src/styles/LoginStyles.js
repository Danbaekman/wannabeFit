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
      fontSize: 38,
      color: '#000000',
      fontWeight: 'bold',
      marginBottom: 20,
    },
    description: {
      alignSelf: 'flex-start',
      textAlign: 'left',
      fontSize: 13,
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
      paddingVertical: 15,  // 더 크게 설정
      paddingHorizontal: 80, // 더 크게 설정
      borderRadius: 10,
      marginBottom: 15,
      justifyContent: 'center',
    },
    kakaoSymbol: {
      width: 30,  // 심볼 크기
      height: 30,
      marginRight: 10, 
    },
    kakaoButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    kakaoText: {
      fontSize: 18,  // 글씨 크기도 키움
      fontWeight: 'bold',
      color: '#3A1D1D',
      flex: 1,
      textAlign: 'center',
    },
    naverButton: {
      backgroundColor: '#03C75A',
      paddingVertical: 15,
      paddingHorizontal: 100,
      borderRadius: 10,
    },
    naverText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
  });
  export default styles;