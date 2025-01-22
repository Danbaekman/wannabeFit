import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabButton: {
    backgroundColor: '#004D4D', // 기본 버튼 배경색
    paddingVertical: 8, // 버튼의 세로 여백
    paddingHorizontal: 20, // 버튼의 가로 여백
    borderRadius: 20, // 둥근 버튼 모서리
    marginHorizontal: 5, // 버튼 간 간격
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF', // 활성화된 버튼 배경색
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1, // 활성화된 버튼 테두리
    borderColor: '#008080',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center', // 텍스트 가운데 정렬
  },
  tabButtonTextActive: {
    fontSize: 16,
    color: '#008080', // 활성화된 버튼의 텍스트 색상
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
