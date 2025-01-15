import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  greetingText: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userName: {
    fontWeight: 'bold',
    color: '#008080',
    fontSize: 24,
  },
  imageContainer: {
    alignSelf: 'center',
    marginVertical: 30,
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#008080',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#008080',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333', // 텍스트 색상은 짙은 회색
  },
  disabledInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  disabledInfoText: {
    fontSize: 16,
    color: '#333', // 텍스트 색상은 동일한 짙은 회색
  },
  disabledIcon: {
    color: '#ccc', // 비활성화된 > 버튼 색상
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10, // 다른 요소 위에 위치
    padding: 10,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#008080',
  },
  goalBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  goalItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  sectionSeparator: {
    width: '100%', // 전체 너비를 덮도록 설정
    height: 10, // 경계선 높이
    backgroundColor: '#F5F5F5', // 경계선 색상
    alignSelf: 'center', // 부모의 정렬 영향을 최소화
  },
  goalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 양 옆으로 배치
    alignItems: 'center', // 수직 가운데 정렬
    marginBottom: 10,
  },
  goalLabel: {
    fontSize: 16,
    color: '#333',
  },
  goalValue: {
    fontSize: 16,
    color: '#008080',
    fontWeight: 'bold',
  },
  
});

export default styles;
