import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  backButton: {
    padding: 10, // 버튼 터치 영역 확장
  },
  finalCompleteButtonContainer: {
    position: 'absolute', // 하단에 고정
    bottom: 20, // 하단 여백
    left: 20, // 좌측 여백
    right: 20, // 우측 여백
    alignItems: 'center',
  },
  finalCompleteButton: {
    backgroundColor: '#008080', // 버튼 색상
    paddingVertical: 10, // 위아래 여백
    paddingHorizontal: 16, // 양옆 여백
    borderRadius: 20, // 둥근 모서리
    alignItems: 'center', // 글자 가운데 정렬
    justifyContent: 'center', // 수직 가운데 정렬
    width: '100%', // 버튼 가로 전체
  },
  finalCompleteButtonText: {
    color: '#fff', // 글자 색상
    fontSize: 18, // 글자 크기
    fontWeight: 'bold', // 글자 굵기
  },
  
  congratsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
    marginBottom: 40,
  },
  goalContainer: {
    marginBottom: 30,
  },
  goalHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    color: '#555', // 부드러운 회색으로 변경 (필요시)
  },
  caloriesContainer: {
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#ccc',    // 테두리 색상
    borderRadius: 10,
    padding: 10,
  },
  caloriesText: {
    fontSize: 16,
    textAlign: "center"
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',  // 회색 줄 색상
    marginVertical: 20, // 위 아래 간격
  },
  targetCaloriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
    color: 'black',
    marginBottom: 10,
  },
  macroContainer: {
    paddingTop: 20,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20, // 내부 간격
  },
  lastMacroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  macroValue: {
    fontSize: 16,
    color: '#555', // g 값 회색
    marginTop: 4, // 탄수화물 아래 g와의 간격
  },
  macroKcal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black', // kcal은 검정색
    textAlign: 'right',
  },
  macroPercentage: {
    fontSize: 16,
    color: '#888', // %는 회색
    textAlign: 'right',
    marginTop: 4, // kcal 아래 %와 간격
  },
  
  borderBox: {
    borderWidth: 1.5, // 테두리 두께
    borderColor: '#ccc', // 테두리 색상
    borderRadius: 10, // 테두리 모서리 둥글게
    padding: 15, // 내부 여백
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: '#008080',
    marginLeft: 5,
  },
  
  
});

export default styles;
