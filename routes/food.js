const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const authenticateToken = require('../middleware/authenticateToken');

// 식단 기록 조회
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find(); // Find 메서드 호출
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 식단 기록 추가
router.post('/', async (req, res) => {
  const { user_id, food_name, protein, fat, calories } = req.body;
  const food = new Food({ user_id, food_name, protein, fat, calories, natrium });

  try {
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 식단 기록 수정
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { food_name, protein, fat, calories,natrium } = req.body;

  try {
    const updatedFood = await Food.findByIdAndUpdate(id, { food_name, protein, fat, calories, natrium }, { new: true });
    if (!updatedFood) return res.status(404).json({ error: 'Food not found' });
    res.json(updatedFood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 식단 기록 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFood = await Food.findByIdAndDelete(id);
    if (!deletedFood) return res.status(404).json({ error: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 음식 검색
router.get('/search', authenticateToken, async (req, res) => {
  const { query } = req.query; // 검색어
  
  try {
    const foods = await Food.find({ food_name: { $regex: query, $options: 'i' } });
    
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 음식 세트 추가
router.post('/set', authenticateToken, async (req, res) => {
  const { foodIds } = req.body; // 음식 ID 배열

  try {
    const foods = await Food.find({ '_id': { $in: foodIds } });

    // 세트 추가 로직 (예: 사용자 DB에 저장)
    // 이곳에서 원하는 세트 형식으로 저장하거나 사용자에게 반환할 수 있습니다.
    
    res.status(201).json({ message: 'Set created successfully.', foods });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sets - 사용자 세트 조회
router.get('/sets', authenticateToken, async (req, res) => {
  try {
    // 사용자 ID를 기준으로 세트 조회
    const meals = await Meal.find({ user_id: req.user._id }).populate('foods');

    if (!meals.length) {
      return res.status(404).json({ message: 'No meal sets found for this user.' });
    }

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 즐겨찾기 추가
router.post('/favorite', authenticateToken, async (req, res) => {
  const { foodId } = req.body; // 즐겨찾기할 음식 ID

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.favorites) user.favorites = []; // favorites 필드가 없으면 초기화
    if (!user.favorites.includes(foodId)) {
      user.favorites.push(foodId);
      await user.save();
      res.status(200).json({ message: 'Food added to favorites.' });
    } else {
      res.status(400).json({ message: 'Food is already in favorites.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 즐겨찾기 제거
router.delete('/favorite/:foodId', authenticateToken, async (req, res) => {
  const { foodId } = req.params; // 제거할 음식 ID

  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.favorites) {
      return res.status(404).json({ error: 'User or favorites not found.' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== foodId);
    await user.save();
    
    res.status(200).json({ message: 'Food removed from favorites.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
