import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const FoodDetailModal = ({ visible, onClose, food }) => {
  if (!food) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.mealTime}>아침</Text>
          <Text style={styles.modalTitle}>{food.name}</Text>

          <View style={styles.macroDistribution}>
            <Text style={styles.macroLabel}>탄수화물 59%</Text>
            <Text style={styles.macroLabel}>단백질 17%</Text>
            <Text style={styles.macroLabel}>지방 22%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, { backgroundColor: 'green', width: '59%' }]} />
              <View style={[styles.progressSegment, { backgroundColor: 'blue', width: '17%' }]} />
              <View style={[styles.progressSegment, { backgroundColor: 'yellow', width: '22%' }]} />
            </View>
          </View>

          <View style={styles.foodDetails}>
            <Text>총 칼로리: {food.kcal}</Text>
            <Text>탄수화물: 18.14g</Text>
            <Text>단백질: 5.34g</Text>
            <Text>지방: 3.02g</Text>
            <Text>당: 3.22g</Text>
            <Text>나트륨: 253.94mg</Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  macroDistribution: {
    width: '100%',
    marginBottom: 10,
  },
  macroLabel: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
  },
  progressBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  progressSegment: {
    height: '100%',
  },
  foodDetails: {
    marginVertical: 10,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#00A896',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodDetailModal;
