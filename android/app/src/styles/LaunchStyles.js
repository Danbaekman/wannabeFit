import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 40,
      justifyContent: 'center',
      backgroundColor: '#ffffff', // 배경 색
      alignItems: 'center',
    },

    // 이상적인 몸을 향해
    title: {
      fontSize: 38,
      fontWeight: 'bold',
      color: '#000',
      alignSelf: 'flex-start'
    },

    // 메인로고(wannabefit)
    subtitle: {
      fontSize: 38,
      fontWeight: 'bold',
      color: '#008080',
      marginBottom: 20,
      alignSelf: 'flex-start'
    },

    description: {
      fontSize: 14,
      color: '#000',
      textAlign: 'left',
      marginBottom: 60,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 40,
    },

    circle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: '#ffffff', // 이 부분은 아이콘으로 변경 가능
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.7,                // 테두리 굵기
      borderColor: '#008080',
      marginRight: 10,  
    },

    image: {
        width: '60%',                 // 이미지가 원에 맞게 채워짐
        height: '60%',
        resizeMode: 'cover',
        backgroundColor: '#ffffff'           // 이미지가 원에 맞게 잘리도록 설정
      },
      
    featureText: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 4
    },
    featureDescription: {
      fontSize: 12,
      color: '#000',
    },

    startButton: {
      backgroundColor: '#008080',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginTop: 40,
      alignItems: 'center',
      width: 250,
    },

    startButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    },

    loginButton: {
      marginTop: 20,
      alignItems: 'center', 
    },

    loginText: {
      color: '#000',
      fontSize: 12,
      marginRight: 5,
    },

    loginLink: {
      color: '#008080',
      fontSize: 13,
      fontWeight: 'bold',
    },
  });

  export default styles;