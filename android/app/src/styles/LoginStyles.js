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
  LogoText: {
    textAlign: 'center',
    fontSize: 50,
    color: '#008080',
    fontWeight: 'bold',
    paddingTop: 100,
  },
  logoSubtitle: {
    textAlign: 'center',
    fontSize: 20,
    color: '#008080',
    fontWeight: 'bold', 
    paddingBottom: 100,
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
