import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from './GoalSelectionModalStyles';

const GoalSelectionModal = ({ isVisible, onClose, selectGoal, goal, handleSubmit }) => {
  return (
    <Modal 
      isVisible={isVisible} 
      onBackdropPress={onClose} 
      backdropColor="black"
      backdropOpacity={0.5}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        {/* 닫기 버튼 (X) */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.modalTitle}>나의 운동 목적은?</Text>
        <Text style={styles.modalSubtitle}>목적에 맞춰 식단과 운동법을 추천드립니다.</Text>

        {/* 벌크업 선택 */}
        <TouchableOpacity onPress={() => selectGoal('bulk')}>
          <View style={styles.modalOption}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="weight-lifter" size={30} color="#008080" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.modalText}>벌크업</Text>
              <Text style={styles.modalDescription}>근육 증가를 목표로 합니다.</Text>
              <Text style={styles.modalDescription}>
              탄수화물: 50% / 단백질: 25% / 지방: 20%</Text>
              <Text style={styles.modalDescription}>TDEE + 500 kcal</Text>
            </View>
            <View style={[styles.checkCircle, goal === 'bulk' ? styles.checkCircleSelected : null]} />
          </View>
        </TouchableOpacity>

        {/* 다이어트 선택 */}
        <TouchableOpacity onPress={() => selectGoal('diet')}>
          <View style={styles.modalOption}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="running" size={30} color="#008080" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.modalText}>다이어트</Text>
              <Text style={styles.modalDescription}>체지방 감량을 목표로 합니다.</Text>
              <Text style={styles.modalDescription}>
              탄수화물: 30% / 단백질: 45% / 지방: 25%</Text>
              <Text style={styles.modalDescription}>TDEE - 500 kcal</Text>
            </View>
            <View style={[styles.checkCircle, goal === 'diet' ? styles.checkCircleSelected : null]} />
          </View>
        </TouchableOpacity>

        {/* 유지 선택 */}
        <TouchableOpacity onPress={() => selectGoal('maintain')}>
          <View style={styles.modalOption}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="walk" size={30} color="#008080" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.modalText}>유지</Text>
              <Text style={styles.modalDescription}>현제 체중과 체지방을 유지합니다.</Text>
              <Text style={styles.modalDescription}>
              탄수화물: 50% / 단백질: 25% / 지방: 20%</Text>
              <Text style={styles.modalDescription}>TDEE 유지</Text>
            </View>
            <View style={[styles.checkCircle, goal === 'maintain' ? styles.checkCircleSelected : null]} />
          </View>
        </TouchableOpacity>

        {/* 완료 버튼 */}
        <TouchableOpacity onPress={handleSubmit} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default GoalSelectionModal;
