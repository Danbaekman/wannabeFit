const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken'); // 인증 미들웨어
const calculateBMRAndTDEE = require('../utils/calculateBMR'); // BMR 계산 함수

// Input validation middleware
const validateUserInput = (req, res, next) => {
  const { gender, height, weight, birthdate, targetWeight, exerciseFrequency, goal } = req.body;

  if (!gender || !height || !weight || !birthdate || !targetWeight || !exerciseFrequency || !goal) {
    console.error('Input validation failed: All fields are required.');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  next();
};

// 사용자 등록
router.post('/register', authenticateToken, validateUserInput, async (req, res) => {
  try {
    const { gender, height, weight, birthdate, targetWeight, exerciseFrequency, goal } = req.body;

    const userFromDb = await User.findById(req.user._id);
    if (!userFromDb) {
      console.error('User not found during registration.');
      return res.status(404).json({ error: 'User not found.' });
    }

    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthdate).getFullYear();
    const age = currentYear - birthYear;

    const { bmr, tdee, totalCalories, macros, weeksToGoal } = calculateBMRAndTDEE(gender, weight, height, age, exerciseFrequency, goal, targetWeight);
    console.log('Calculated totalCalories:', totalCalories);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        email: userFromDb.email,
        name: userFromDb.name,
        gender,
        height,
        weight,
        age,
        bmr,
        tdee,
        targetWeight,
        exerciseFrequency,
        recommended_protein: macros.protein,
        recommended_fat: macros.fat,
        recommended_carbs: macros.carbs,
        goal,
        weeksToGoal,
        target_calories: totalCalories,
        updated_at: Date.now(),
      },
      { new: true, upsert: true }
    );

    console.log('User registered successfully:', updatedUser);
    res.status(201).json({ message: 'User registered successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 사용자 정보 수정
router.put('/update', authenticateToken, validateUserInput, async (req, res) => {
  try {
    const { name, gender, height, weight, birthdate, targetWeight, exerciseFrequency, goal } = req.body;

    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthdate).getFullYear();
    const age = currentYear - birthYear;

    const { bmr, tdee, totalCalories, macros, weeksToGoal } = calculateBMRAndTDEE(gender, weight, height, age, exerciseFrequency, goal, targetWeight);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        gender,
        height,
        weight,
        bmr,
        tdee,
        age,
        targetWeight,
        exerciseFrequency,
        recommended_protein: macros.protein,
        recommended_fat: macros.fat,
        recommended_carbs: macros.carbs,
        goal,
        weeksToGoal,
        target_calories: totalCalories,
        updated_at: Date.now()
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error('User not found during update.');
      return res.status(404).json({ error: 'User not found.' });
    }

    console.log('User updated successfully:', updatedUser);
    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/user/delete - 사용자 삭제
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      console.error('User not found during deletion.');
      return res.status(404).json({ error: 'User not found.' });
    }

    console.log('User deleted successfully:', deletedUser);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user - 사용자 정보 조회
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      console.error('User not found during retrieval.');
      return res.status(404).json({ error: 'User not found.' });
    }

    console.log('User retrieved successfully:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
