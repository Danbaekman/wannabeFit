import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#008080',
    },
    statsSection: {
      marginBottom: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      elevation: 2,
      padding: 20,
      position: 'relative',
      flexDirection: 'column',
      overflow: 'visible',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    periodButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: 15,
      marginBottom: 1,
      marginTop: 1,
      backgroundColor: '#F5F5F5', // 버튼 컨테이너 배경 회색
      borderRadius: 10,
      paddingVertical: 5,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 10,
      marginHorizontal: 5,
      alignItems: 'center',
      borderRadius: 5,
    },
    periodButtonActive: {
      backgroundColor: '#FFFFFF', // 활성 버튼 배경 흰색
    },
    periodButtonInactive: {
      backgroundColor: '#F5F5F5', // 비활성 버튼 배경 회색
    },
    periodButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    periodButtonTextActive: {
      color: '#008080', // 활성 버튼 글자색
    },
    periodButtonTextInactive: {
      color: '#666666', // 비활성 버튼 글자색 (더 진한 회색)
    },
    inputSection: {
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 10,
      elevation: 2,
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      color: '#333',
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
      marginBottom: 10,
    },
    submitButton: {
      backgroundColor: '#008080',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    historySection: {
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 10,
      elevation: 2,
      marginBottom: 20,
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    historyDate: {
      fontSize: 14,
      color: '#666',
    },
    historyWeight: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
    },
    noDataText: {
      textAlign: 'center',
      color: '#999',
      fontSize: 14,
      marginTop: 10,
    },

      summaryText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
      },
      goalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#008080', // 목표 체중 텍스트 색상
        marginTop: 10,
      },
      goalWeight: {
        fontSize: 18,
        color: '#0000FF', // 남은 체중 숫자 색상 (파란색)
        fontWeight: 'bold',
      },
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 30,
      },
      summaryColumn: {
        flex: 1,
        alignItems: 'center',
      },
      divider: {
        width: 1,
        backgroundColor: '#CCCCCC',
        height: 60,
      },
      summaryLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
        textAlign: 'center',
      },
      summaryValue: {
        fontSize: 20,
        color: '#333',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
      },
  });
  
