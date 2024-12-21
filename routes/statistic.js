const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const moment = require('moment');
const WorkoutLog = require('../models/WorkoutLog');
const Meal = require('../models/Meal');
const Inbody = require('../models/Inbody');
const User = require('../models/User');
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

// 총 칼로리 섭취량 API
router.get('/calories/total', authenticateToken, async (req, res) => {
  const { period = 'week' } = req.query; // 기간(e.g., day, week, month)을 쿼리로 받음
  console.log('Requested period for total calories:', period);
  const { startDate, endDate } = await getDateRange(period); // 비동기 호출로 시작일과 종료일을 기본 값으로 설정
  console.log('Calculated date range:', { startDate, endDate });

  try {
        // Meal 컬렉션에서 사용자 ID와 기간에 해당하는 데이터 집계
        const totalCalories = await Meal.aggregate([
          {
              $match: {
                  user_id: new mongoose.Types.ObjectId(req.user.id), // user_id로 필터링
                  created_at: { $gte: new Date(startDate), $lte: new Date(endDate) } // 날짜 범위 필터링
              }
          },
          {
              $group: {
                  _id: null,
                  totalCalories: { $sum: "$total_calories" } // 총 칼로리 합산
              }
          }
      ]);
      
     
      console.log('Total calories calculated:', totalCalories);

      // 응답으로 총 칼로리 반환
      res.json({
          totalCalories: totalCalories.length ? totalCalories[0].totalCalories : 0 // 데이터가 있을 경우 총 칼로리 반환, 없으면 0
      });
  } catch (error) {
      console.error('Error in total calories API:', error.message);
      res.status(500).json({ error: error.message }); // 오류 발생 시 오류 메시지 반환
  }
});

// 영양소 분포 API
router.get('/nutrition/distribution', authenticateToken, async (req, res) => {
  const { period } = req.query; // 기간을 쿼리로 받음
  console.log('Requested period for nutrition distribution:', period);

  try {
      const { startDate, endDate } = await getDateRange(period); // 비동기 호출로 기간에 맞는 시작일과 종료일 계산
      console.log('Calculated date range:', { startDate, endDate });

      // Meal 컬렉션에서 기간에 해당하는 데이터 집계
      const nutrientData = await Meal.aggregate([
          {
              $match: {
                  user_id: new mongoose.Types.ObjectId(req.user.id), // 사용자의 ID로 필터링
                  created_at: { $gte: new Date(startDate), $lte: new Date(endDate) } // 기간 필터링
              }
          },
          {
              $group: {
                  _id: null,
                  totalProtein: { $sum: "$total_protein" }, // 단백질 합산
                  totalFat: { $sum: "$total_fat" }, // 지방 합산
                  totalCarbs: { $sum: "$total_carbohydrates" } // 탄수화물 합산
              }
          }
      ]);

      console.log('Nutrient distribution data:', nutrientData);

      if (nutrientData.length) {
          const { totalProtein, totalFat, totalCarbs } = nutrientData[0];
          const total = totalProtein + totalFat + totalCarbs; // 총 영양소 합산

          // 비율 계산 및 응답
          res.json({
              protein: total ? ((totalProtein / total) * 100).toFixed(2) + '%' : '0%',
              fat: total ? ((totalFat / total) * 100).toFixed(2) + '%' : '0%',
              carbs: total ? ((totalCarbs / total) * 100).toFixed(2) + '%' : '0%'
          });
      } else {
          // 데이터가 없으면 0% 반환
          res.json({ protein: '0%', fat: '0%', carbs: '0%' });
      }
  } catch (error) {
      console.error('Error in nutrition distribution API:', error.message);
      res.status(500).json({ error: error.message }); // 오류 발생 시 오류 메시지 반환
  }
});


// 음식 빈도 API
router.get('/nutrition/frequency', authenticateToken, async (req, res) => {
  const { period } = req.query; // 기간을 쿼리로 받음
  console.log('Requested period for food frequency:', period);

  try {
      const { startDate, endDate } = await getDateRange(period); // 비동기 호출로 시작일과 종료일 계산
      console.log('Calculated date range:', { startDate, endDate });

      // Meal 컬렉션에서 음식 항목을 분리하여 빈도 계산
      const foodFrequency = await Meal.aggregate([
          {
              $match: {
                  user_id: new mongoose.Types.ObjectId(req.user.id), // 사용자의 ID로 필터링
                  created_at: { $gte: new Date(startDate), $lte: new Date(endDate) } // 기간 필터링
              }
          },
          {
              $unwind: "$foods" // "foods" 배열을 펼침
          },
          {
              $group: {
                  _id: "$foods", // 음식 항목별로 그룹화
                  count: { $sum: 1 } // 각 음식 항목의 빈도 계산
              }
          },
          {
              $lookup: {
                  from: "foods", // 조인할 컬렉션 이름
                  localField: "_id", // 현재 컬렉션에서 조인할 필드
                  foreignField: "_id", // 조인할 컬렉션의 필드
                  as: "foodDetails" // 결과를 저장할 필드
              }
          },
          {
              $unwind: "$foodDetails" // 조인 결과를 펼침
          },
          {
              $project: {
                  _id: 0, // _id 필드를 숨김
                  food_name: "$foodDetails.food_name", // food_name 필드만 표시
                  count: 1 // count 필드를 유지
              }
          },
          {
              $sort: { count: -1 } // 빈도가 높은 순으로 정렬
          }
      ]);

      console.log('Food frequency data:', foodFrequency);

      res.json(foodFrequency); // 빈도 결과 반환
  } catch (error) {
      console.error('Error in food frequency API:', error.message);
      res.status(500).json({ error: error.message }); // 오류 발생 시 오류 메시지 반환
  }
});




// 목표 대비 실제 섭취 API
router.get('/nutrition/goal-comparison', authenticateToken, async (req, res) => {
  const { period } = req.query; // 기간만 쿼리로 받음
  console.log('Requested period for goal comparison:', period);

  try {
      // 사용자 정보 가져오기
      const user = await User.findById(req.user.id); // 인증된 사용자 ID로 사용자 정보 조회
      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      const { target_calories, recommended_protein, recommended_fat, recommended_carbs } = user;
      console.log('User goals from database:', { 
          target_calories, 
          recommended_protein, 
          recommended_fat, 
          recommended_carbs 
      });

      // 기간 검증 및 계산
      const { startDate, endDate } = await getDateRange(period);
      if (!startDate || !endDate) {
          return res.status(400).json({ error: 'Invalid period. Please provide a valid period.' });
      }
      console.log('Calculated date range:', { startDate, endDate });

      // 실제 섭취량 집계
      const actualIntake = await Meal.aggregate([
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(req.user.id), // 사용자의 ID로 필터링
            created_at: { $gte: new Date(startDate), $lte: new Date(endDate) } // 기간 필터링
          }
        },
        {
          $group: {
            _id: null,
            totalCalories: { $sum: "$total_calories" }, // 총 칼로리 합산 (total_calories로 변경)
            totalProtein: { $sum: "$total_protein" }, // 총 단백질 합산
            totalFat: { $sum: "$total_fat" }, // 총 지방 합산
            totalCarbs: { $sum: "$total_carbohydrates" } // 총 탄수화물 합산
          }
        }
      ]);
      

      console.log('Actual intake data:', actualIntake);

      // 섭취 데이터가 없을 경우 처리
      if (actualIntake.length === 0) {
          console.log('No data found for the specified period.');
          return res.json({ 
              calorieComparison: '0%', 
              proteinComparison: '0%', 
              fatComparison: '0%', 
              carbsComparison: '0%' 
          });
      }

      // 섭취량 비교 계산
      const { totalCalories, totalProtein, totalFat, totalCarbs } = actualIntake[0];
      console.log('Total intake values:', { totalCalories, totalProtein, totalFat, totalCarbs });

      const comparisonData = {
          calorieComparison: target_calories ? ((totalCalories / target_calories) * 100).toFixed(2) + '%' : 'N/A',
          proteinComparison: recommended_protein ? ((totalProtein / recommended_protein) * 100).toFixed(2) + '%' : 'N/A',
          fatComparison: recommended_fat ? ((totalFat / recommended_fat) * 100).toFixed(2) + '%' : 'N/A',
          carbsComparison: recommended_carbs ? ((totalCarbs / recommended_carbs) * 100).toFixed(2) + '%' : 'N/A'
      };

      console.log('Comparison data:', comparisonData);

      res.json(comparisonData); // 결과 반환
  } catch (error) {
      console.error('Error in goal comparison API:', error);
      res.status(500).json({ error: 'An error occurred while processing the request.' }); // 오류 메시지 반환
  }
});





const getDateRange = (period) => {
  const now = moment(); // 현재 시간
  let startDate, endDate;

  switch (period) {
    case 'day':
      startDate = now.startOf('day').toDate(); // 오늘 시작
      endDate = now.endOf('day').toDate();   // 오늘 끝
      break;
    case 'week':
      startDate = now.startOf('week').toDate(); // 이번 주 시작 (ISO-8601, 일요일 기준)
      endDate = now.endOf('week').toDate();     // 이번 주 끝
      break;
    case 'month':
      startDate = now.startOf('month').toDate(); // 이번 달 시작
      endDate = now.endOf('month').toDate();     // 이번 달 끝
      break;
    case 'year':  // 올해의 날짜 범위
      startDate = now.startOf('year').toDate(); // 올해 시작 (1월 1일)
      endDate = now.endOf('year').toDate();     // 올해 끝 (12월 31일)
      break;
    default:
      startDate = now.startOf('week').toDate();
      endDate = now.endOf('week').toDate();
  }

  return { startDate, endDate };
};

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

// 총 운동 통계 조회
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    console.log('총 통계 요청:', { userId });

    // 총 운동 통계 계산
    const totalStats = await WorkoutLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          $expr: { $gte: ['$endTime', '$startTime'] },
        },
      },
      { $unwind: '$exercises' },
      { $unwind: '$exercises.sets' },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
          totalWorkoutTime: {
            $sum: {
              $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60], // 밀리초 -> 분
            },
          },
          totalVolume: {
            $sum: {
              $multiply: ['$exercises.sets.weight', '$exercises.sets.reps'],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalWorkoutTime: { $sum: '$totalWorkoutTime' },
          totalVolume: { $sum: '$totalVolume' },
          totalDays: { $sum: 1 },
        },
      },
    ]);

    const totalWorkoutTime = Math.floor(totalStats[0]?.totalWorkoutTime || 0);
    const totalVolume = totalStats[0]?.totalVolume || 0;
    const totalDays = totalStats[0]?.totalDays || 0;

    console.log('총 통계 결과:', { totalWorkoutTime, totalVolume, totalDays });

    res.status(200).json({
      totalWorkoutTime,
      totalVolume,
      totalDays,
    });
  } catch (error) {
    console.error('총 통계 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/weekly', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    console.log('주당 운동 횟수 요청:', { userId });

    const weeklyStats = await WorkoutLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          $expr: { $gte: ['$endTime', '$startTime'] },
        },
      },
      {
        $group: {
          _id: { $isoWeek: '$startTime' }, // ISO 주 단위로 그룹화
          workoutCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log('주당 운동 횟수 결과:', weeklyStats);

    res.status(200).json(weeklyStats);
  } catch (error) {
    console.error('주당 운동 횟수 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});

  

router.get('/total-sets', authenticateToken, async (req, res) => {
  try {
    let { id: userId } = req.user;
    let { period = 'day', startDate, endDate } = req.query; // startDate와 endDate를 let으로 선언

    if (!startDate || !endDate) {
      const defaultDates = await getDefaultDateRange(Inbody, { userId: new mongoose.Types.ObjectId(userId) }, 'date');
      startDate = startDate || defaultDates.startDate;
      endDate = endDate || defaultDates.endDate;
    }

    const match = {
      user: new mongoose.Types.ObjectId(userId),
      startTime: { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate)
      },
      $expr: { $gte: ['$endTime', '$startTime'] },
    };

    const groupId = getGroupId(period, 'startTime');

    const totalSetsStats = await WorkoutLog.aggregate([
      { $match: match },
      { $unwind: '$exercises' },
      { $unwind: '$exercises.sets' },
      {
        $group: {
          _id: groupId,
          totalSets: { $sum: 1 }, // 세트 개수
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log('총 세트 수 결과:', totalSetsStats);

    res.status(200).json(totalSetsStats);
  } catch (error) {
    console.error('총 세트 수 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
