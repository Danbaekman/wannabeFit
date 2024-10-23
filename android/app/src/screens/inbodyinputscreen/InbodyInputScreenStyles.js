import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 20,
      borderRadius: 8,
    },
    genderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    genderButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#ccc',
    },
    selectedGenderButton: {
      borderColor: '#008080',
    },
    genderButtonText: {
      marginLeft: 8,
    },
    selectedGenderText: {
      color: '#008080',
    },
    picker: {
      height: 50,
      marginBottom: 20,
    },
    goalButton: {
      backgroundColor: '#008080',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20,
    },
    goalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },

// 모달 스타일
modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',  // 하단에 모달을 배치
    },
    modalContent: {
    width: '100%',
    height: '60%',  // 모달창 화면 대비 크기
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    },

    iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,  // 원형으로 만들기
    backgroundColor: '#e0e0e0', // 기본 배경색
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'black',
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 20,
        color: 'gray',
      },

    modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 15,
    color: 'black',
    },
    modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    },
      
    modalDescription: {
    fontSize: 12,
    color: 'gray',
    flex: 1,
    marginLeft: 15,
    },

    textContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
        marginTop: 20,
      },
    
    modalButton: {
      marginTop: 10,
      backgroundColor: '#008080',
      padding: 10,
      borderRadius: 8,
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'gray',
        backgroundColor: 'white',
      },
      checkCircleSelected: {
        borderColor: '#008080',
        backgroundColor: '#008080',
      },
      completeButton: {
        backgroundColor: '#008080',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
      },
      completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
  });
  
  export default styles;
  