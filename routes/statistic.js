const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const WorkoutLog = require('../models/WorkoutLog');
const Meal = require('../models/Meal');
const Inbody = require('../models/Inbody');
const authenticateToken = require('../middleware/authenticateToken');

// **현재까지 운동한 총 시간 및 일 단위 반환**
router.get('/workout/total', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    console.log('총 운동 시간 요청:', { userId });

    // 총 운동 시간 및 운동 일수 계산
    const totalStats = await WorkoutLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId), // 유저 매칭
          $expr: { $gte: ['$endTime', '$startTime'] }, // 유효한 시간 필터링
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }, // 날짜 단위로 그룹화
          totalWorkoutTime: {
            $sum: {
              $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60], // 밀리초 -> 분
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalWorkoutTime: { $sum: '$totalWorkoutTime' }, // 총 운동 시간 합산
          totalDays: { $sum: 1 }, // 하루 단위로 카운팅
        },
      },
    ]);

    // 결과 가져오기
    const totalWorkoutTime = totalStats[0]?.totalWorkoutTime || 0;
    const totalDays = totalStats[0]?.totalDays || 0;

    console.log('총 운동 시간 및 운동 일수:', { totalWorkoutTime, totalDays });

    res.status(200).json({
      totalWorkoutTime, // 총 운동 시간 (분)
      totalDays, // 총 운동 일수
    });
  } catch (error) {
    console.error('총 운동 시간 계산 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});



// **공통 유틸 함수: 기본 날짜 가져오기**
async function getDefaultDateRange(model, matchCondition, dateField = 'created_at') {
  const dateRange = await model.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        minDate: { $min: `$${dateField}` },
        maxDate: { $max: `$${dateField}` },
      },
    },
  ]);
  return {
    startDate: dateRange[0]?.minDate ? dateRange[0].minDate.toISOString() : new Date(0).toISOString(),
    endDate: new Date().toISOString(),
  };
}

// **공통 유틸 함수: 그룹화 키 가져오기**
function getGroupId(period, dateField) {
  switch (period) {
    case 'day':
      return { $dateToString: { format: '%Y-%m-%d', date: `$${dateField}` } };
    case 'week':
      return { $isoWeek: `$${dateField}` };
    case 'month':
      return { $dateToString: { format: '%Y-%m', date: `$${dateField}` } };
    case 'year':
      return { $year: `$${dateField}` };
    default:
      throw new Error('Invalid period. Use "day", "week", "month", or "year".');
  }
}

// **공통 유틸 함수: 통계 조회 로직**
async function fetchStats(model, match, groupId, projection) {
  return await model.aggregate([
    { $match: match },
    {
      $group: {
        _id: groupId,
        ...projection,
      },
    },
    {
      $project: {
        _id: 1,
        ...Object.keys(projection).reduce((acc, key) => ({ ...acc, [key]: 1 }), {}),
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

// **운동 통계 조회**
router.get('/workout', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { period, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const defaultDates = await getDefaultDateRange(WorkoutLog, { user: new mongoose.Types.ObjectId(userId) }, 'startTime');
      startDate = startDate || defaultDates.startDate;
      endDate = endDate || defaultDates.endDate;
    }

    console.log('운동 통계 요청:', { userId, period, startDate, endDate });

    // 매칭 조건: 유효한 `startTime`과 `endTime` 범위 내에서만 데이터 가져오기
    const match = {
      user: new mongoose.Types.ObjectId(userId),
      startTime: { $gte: new Date(startDate), $lte: new Date(endDate) },
      $expr: { $gte: ['$endTime', '$startTime'] }, // endTime >= startTime인 데이터만 포함
    };

    const groupId = getGroupId(period, 'startTime');
    const workoutStats = await WorkoutLog.aggregate([
      { $match: match },
      { $unwind: '$exercises' }, // exercises 배열 펼치기
      { $unwind: '$exercises.sets' }, // sets 배열 펼치기
      {
        $group: {
          _id: groupId,
          totalWorkoutTime: {
            $sum: {
              $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60], // 밀리초를 분 단위로 변환
            },
          },
          totalVolume: {
            $sum: {
              $multiply: ['$exercises.sets.weight', '$exercises.sets.reps'], // 볼륨 계산 (weight * reps)
            },
          },
          daysTracked: {
            $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalWorkoutTime: 1,
          totalVolume: 1,
          daysTracked: { $size: '$daysTracked' }, // 고유 날짜 수 계산
        },
      },
      { $sort: { _id: 1 } }, // 날짜 정렬
    ]);

    console.log('운동 통계 결과:', workoutStats);
    res.status(200).json(workoutStats);
  } catch (error) {
    console.error('운동 통계 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// **식단 통계 조회**
router.get('/diet', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { period, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const defaultDates = await getDefaultDateRange(Meal, { user_id: new mongoose.Types.ObjectId(userId) });
      startDate = startDate || defaultDates.startDate;
      endDate = endDate || defaultDates.endDate;
    }

    console.log('식단 통계 요청:', { userId, period, startDate, endDate });

    const match = {
      user_id: new mongoose.Types.ObjectId(userId), // 'new' 추가
      created_at: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    const groupId = getGroupId(period, 'created_at');
    const dietStats = await fetchStats(Meal, match, groupId, {
      totalProtein: { $sum: '$total_protein' },
      totalFat: { $sum: '$total_fat' },
      totalCarbs: { $sum: '$total_carbohydrates' },
      totalCalories: { $sum: '$total_calories' },
    });

    console.log('식단 통계 결과:', dietStats);
    res.status(200).json(dietStats);
  } catch (error) {
    console.error('식단 통계 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// **체중 통계 조회**
router.get('/weight', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { period, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const defaultDates = await getDefaultDateRange(Inbody, { userId: new mongoose.Types.ObjectId(userId) }, 'date');
      startDate = startDate || defaultDates.startDate;
      endDate = endDate || defaultDates.endDate;
    }

    console.log('체중 통계 요청:', { userId, period, startDate, endDate });

    const match = {
      userId: new mongoose.Types.ObjectId(userId), // 'new' 추가
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    const groupId = getGroupId(period, 'date');
    const weightStats = await fetchStats(Inbody, match, groupId, {
      averageWeight: { $avg: '$weight' },
      minWeight: { $min: '$weight' },
      maxWeight: { $max: '$weight' },
    });

    console.log('체중 통계 결과:', weightStats);
    res.status(200).json(weightStats);
  } catch (error) {
    console.error('체중 통계 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
