import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080', // 상단 여백 배경색
  },
  statsSection: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'left', // 제목을 좌측 정렬
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  buttonContainer: {
    paddingVertical: 10,
  },
  statButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    elevation: 2,
  },
  statButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
