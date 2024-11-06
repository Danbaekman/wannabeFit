import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContentContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    position: 'relative', // 부모 요소의 위치를 기준으로 totalTimeContainer를 절대 위치시킴
  },
  dateSquare: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dayText: {
    fontSize: 12,
    color: '#555',
  },
  squareDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryContent: {
    flex: 1,
  },
  routineNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 8,
  },
  totalTimeContainer: {
    position: 'absolute',
    top: 16, // 우측 상단으로 배치
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalTimeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  noMemoText: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  exerciseListContainer: {
    marginBottom: 12,
  },
  exerciseItem: {
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
  },
  setDetails: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  volumeChangesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  volumeChangeBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    width: '100%',
  },
  volumeChangeText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  noVolumeChangeText: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default styles;
