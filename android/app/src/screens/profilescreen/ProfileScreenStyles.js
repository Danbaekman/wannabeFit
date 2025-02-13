import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
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
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfileIcon: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70, // 원형 유지
    backgroundColor: '#f0f0f0', // 배경색 추가 (필요하면)
    overflow: 'hidden', // 내부 아이콘이 넘치지 않도록 설정
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#008080',
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 20,
    color: 'black',
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
    fontSize: 18,
    color: '#4F4F4F',
    padding: 10,
  },
  goalValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  goalValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right', // 우측 정렬
    marginRight: 8, // 아이콘과 간격
  },
  
});

export default styles;
