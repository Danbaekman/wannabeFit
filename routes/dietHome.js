const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Meal = require('../models/Meal');
const authenticateToken = require('../middleware/authenticateToken');

// 사용자 정보와 특정 날짜의 식사 정보 가져오기
router.get('/', authenticateToken, async (req, res) => {
  const { date } = req.query;

  try {
    // 사용자 정보 조회
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // 해당 날짜의 식사 정보 조회
    const meals = await Meal.find({
      user_id: req.user._id,
      created_at: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)), // 다음 날
      }
    }).populate('foods');

    res.status(200).json({ user, meals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 날짜와 식사 유형으로 식사 정보 가져오기
router.get('/meals', authenticateToken, async (req, res) => {
  const { date, meal_type } = req.query;

  try {
    const meals = await Meal.find({
      user_id: req.user._id,
      meal_type,
      created_at: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)), // 다음 날
      }
    }).populate('foods');

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
