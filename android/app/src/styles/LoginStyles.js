import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  backButtonContainer: {
    alignSelf: 'flex-start', // 왼쪽에 고정
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 60,
  },
  image: {
    width: 160, // 가로 크기 조정
    height: 160, // 세로 크기 조정
    resizeMode: 'contain', // 비율 유지하면서 조정
    borderRadius: 40,
  },
  backButton: {
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
    lineHeight: 22,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
  socialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // 버튼 간 균등한 간격
    alignItems: 'center',
    width: '100%', // 버튼 컨테이너 너비를 부모 크기만큼 설정
    marginTop: 20,
  },
});

export default styles;
