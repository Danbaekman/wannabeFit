const express = require('express');
const router = express.Router();
const Weight = require('../models/Weight');
const authenticateToken = require('../middleware/authenticateToken');

// POST /api/weight - 특정 날짜에 몸무게 저장/업데이트
router.post('/weight-update', authenticateToken, async (req, res) => {
  try {
    const { weight, date } = req.body; // 클라이언트에서 날짜와 몸무게를 받음

    if (!weight || !date) {
      return res.status(400).json({ error: 'Weight and date are required.' });
    }

    // 날짜 형식을 ISO 형식으로 변환
    const formattedDate = new Date(date).toISOString().split('T')[0];

    if (isNaN(new Date(formattedDate))) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    // 기존 데이터 확인
    const existingWeight = await Weight.findOne({
      user: req.user._id,
      date: formattedDate,
    });

    if (existingWeight) {
      // 기존 데이터가 있으면 업데이트
      existingWeight.weight = weight;
      await existingWeight.save();
      res.status(200).json({ message: 'Weight updated successfully.', weight: existingWeight });
    } else {
      // 없으면 새로 생성
      const newWeight = await Weight.create({
        user: req.user._id,
        date: formattedDate,
        weight,
      });
      res.status(201).json({ message: 'Weight created successfully.', weight: newWeight });
    }
  } catch (error) {
    console.error('Error updating or creating weight:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
      const { date } = req.query;
  
      if (!date) {
        return res.status(400).json({ error: 'Date is required.' });
      }
  
      const weightData = await Weight.findOne({
        user: req.user._id,
        date: new Date(date).toISOString().split('T')[0],
      });
  
      if (!weightData) {
        return res.status(200).json(null); // 데이터가 없으면 null 반환
      }
  
      res.status(200).json(weightData); // weight 데이터 반환
    } catch (error) {
      console.error('Error retrieving weight:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
