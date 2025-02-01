import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },

  // 이상적인 몸을 향해
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start', // 왼쪽 정렬
  },

  // 메인로고(wannabefit)
  subtitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    alignSelf: 'flex-start', // 왼쪽 정렬
  },

  // 워너비 핏과 함께 멋진 몸을 가꾸어 보세요
  description: {
    fontSize: 18,
    color: 'black',
    marginBottom: 60,
    alignSelf: 'flex-start', // 왼쪽 정렬 추가
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },

  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.7,
    borderColor: '#008080',
    marginRight: 10,
  },

  image: {
    width: '60%',
    height: '60%',
    resizeMode: 'cover',
    backgroundColor: '#ffffff',
  },

  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'black',
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
    textAlign: 'center',
  },

  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  loginText: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },

  loginLink: {
    color: '#008080',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;


 