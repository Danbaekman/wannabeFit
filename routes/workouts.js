const express = require('express');
const Workout = require('../models/Workout'); // Workout 모델 불러오기
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // 인증 미들웨어

// 운동 기록하기 (Create)
router.post('/workouts', authenticateToken, async (req, res) => {
  const { routineName, start_time, end_time, generalMemo, date, exercises } = req.body;
  
  try {
    const workout = new Workout({
      user: req.user.id, // 사용자의 ID
      routineName,
      start_time,       // 모델의 필드명에 맞춰 수정
      end_time,         // 모델의 필드명에 맞춰 수정
      generalMemo,
      date,
      exercises,        // 운동 인스턴스 배열
    });

    await workout.save();
    res.status(201).json(workout); // 성공적으로 저장된 운동 데이터를 반환
  } catch (err) {
    res.status(500).json({ message: 'Error recording workout', error: err });
  }
});

// 운동 정보 가져오기 (Read)
router.get('/workouts/:id', authenticateToken, async (req, res) => {
  try {
    // 운동 정보와 exercise 인스턴스를 populate하여 가져옴
    const workout = await Workout.findById(req.params.id).populate('exercises.exercise');
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving workout', error: err });
  }
});

// 월별 통계 가져오기 (Get Statistics)
router.get('/statistics/monthly', async (req, res) => {
  const { month } = req.query;
  
  try {
    const workouts = await Workout.find({
      date: { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) }
    }).populate('exercises.exercise');
    
    // 통계 계산
    const totalVolume = workouts.reduce((acc, workout) => {
      workout.exercises.forEach(ex => {
        acc += ex.weight * ex.reps * ex.sets; // 운동 볼륨 계산
      });
      return acc;
    }, 0);

    const averageWorkoutTime = workouts.reduce((acc, workout) => {
      const duration = (new Date(workout.end_time) - new Date(workout.start_time)) / 60000; // 분 단위
      return acc + duration;
    }, 0) / workouts.length;

    const workoutFrequency = workouts.length;

    res.status(200).json({
      totalVolume,
      averageWorkoutTime: `${Math.floor(averageWorkoutTime / 60)}:${Math.floor(averageWorkoutTime % 60)}`, // 시:분 형식
      workoutFrequency
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching statistics', error: err });
  }
});

module.exports = router;
