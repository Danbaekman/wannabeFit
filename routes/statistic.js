const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const moment = require('moment');
const WorkoutLog = require('../models/WorkoutLog');
const Meal = require('../models/Meal');
const Inbody = require('../models/Inbody');
const User = require('../models/User');
const Weight = require('../models/Weight');
const authenticateToken = require('../middleware/authenticateToken');
const dayjs = require('dayjs');


// 처음 식단 기록한 날 가져오기
router.get('/meal/first-recorded-date', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user; // 인증된 사용자 ID 가져오기

    const firstRecord = await Meal.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId), // 사용자 ID로 필터링
        },
      },
      {
        $group: {
          _id: null,
          firstRecordedDate: { $min: "$created_at" }, // 가장 빠른 created_at 값
        },
      },
    ]);

    // 콘솔에 결과 출력
    if (firstRecord.length > 0) {
      console.log(`처음 식단 기록된 날 user ${userId}:`, firstRecord[0].firstRecordedDate);
      res.status(200).json({ firstRecordedDate: firstRecord[0].firstRecordedDate });
    } else {
      console.log(`No records found for user ${userId}`);
      res.status(404).json({ message: 'No records found for this user.' });
    }
  } catch (error) {
    console.error('Error fetching first recorded date:', error.message);
    res.status(500).json({ error: 'Failed to fetch first recorded date.' });
  }
});


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

// 일별 총 칼로리 API
router.get('/calories/daily', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query; // 클라이언트에서 시작 날짜와 종료 날짜를 쿼리로 전달
  console.log('Requested date range:', { startDate, endDate });

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }

  // 모든 날짜 생성 함수
  const generateDateRange = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate).toISOString().split('T')[0]); // 'YYYY-MM-DD' 형식
      currentDate.setDate(currentDate.getDate() + 1); // 하루씩 증가
    }
    return dateArray;
  };

  const allDates = generateDateRange(startDate, endDate); // 모든 날짜 생성

  try {
    // Meal 컬렉션에서 사용자 ID와 날짜 범위에 해당하는 데이터 집계
    const dailyCalories = await Meal.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(req.user.id), // user_id로 필터링
          created_at: {
            $gte: new Date(startDate), // 시작 날짜
            $lte: new Date(endDate), // 종료 날짜
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, // 날짜별로 그룹화
          totalCalories: { $sum: '$total_calories' }, // 해당 날짜의 총 칼로리 합산
        },
      },
      {
        $sort: { _id: 1 }, // 날짜 오름차순 정렬
      },
    ]);

    console.log('Daily calories calculated:', dailyCalories);

    // 날짜 데이터를 객체 형태로 변환
    const caloriesMap = dailyCalories.reduce((acc, item) => {
      acc[item._id] = item.totalCalories;
      return acc;
    }, {});

    // 누락된 날짜 채우기
    const completeData = allDates.map((date) => ({
      date,
      totalCalories: caloriesMap[date] || 0, // 기록이 없으면 0
    }));

    res.json(completeData); // 모든 날짜와 총 칼로리를 응답
  } catch (error) {
    console.error('Error in daily calories API:', error.message);
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

router.get('/nutrition/goal-comparison', authenticateToken, async (req, res) => {
  const { period = '전체' } = req.query;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // 기간 설정
    const { startDate, endDate } = await getDateRange(period, req.user.id);

    console.log('기간:', { startDate, endDate });

    // 데이터 필터링 및 평균 계산
    const actualIntake = await Meal.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(req.user.id),
          created_at: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          avgCalories: { $avg: "$total_calories" },
          avgProtein: { $avg: "$total_protein" },
          avgFat: { $avg: "$total_fat" },
          avgCarbs: { $avg: "$total_carbohydrates" },
        },
      },
    ]);

    if (actualIntake.length === 0) {
      return res.json({ error: 'No data found for the given period.' });
    }

    const { target_calories, recommended_protein, recommended_fat, recommended_carbs } = user;
    const comparisonData = {
      calorieComparison: target_calories
        ? ((actualIntake[0].avgCalories / target_calories) * 100).toFixed(2) + '%'
        : 'N/A',
      proteinComparison: recommended_protein
        ? ((actualIntake[0].avgProtein / recommended_protein) * 100).toFixed(2) + '%'
        : 'N/A',
      fatComparison: recommended_fat
        ? ((actualIntake[0].avgFat / recommended_fat) * 100).toFixed(2) + '%'
        : 'N/A',
      carbsComparison: recommended_carbs
        ? ((actualIntake[0].avgCarbs / recommended_carbs) * 100).toFixed(2) + '%'
        : 'N/A',
    };

    res.json(comparisonData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



const getDateRange = async (period, userId) => {
  const now = moment(); // 현재 시간
  let startDate, endDate;

  if (period === '전체') {
    // 최초 기록된 날짜 가져오기
    const firstRecordResponse = await Meal.findOne({ user_id: userId }).sort({ created_at: 1 });
    startDate = firstRecordResponse ? firstRecordResponse.created_at : new Date(0); // 없으면 1970년
    endDate = new Date(); // 현재 시간
  } else {
    switch (period) {
      case '1주일':
        startDate = now.clone().subtract(1, 'weeks').startOf('day').toDate();
        endDate = now.endOf('day').toDate();
        break;
      case '1개월':
        startDate = now.clone().subtract(1, 'months').startOf('day').toDate();
        endDate = now.endOf('day').toDate();
        break;
      case '3개월':
        startDate = now.clone().subtract(3, 'months').startOf('day').toDate();
        endDate = now.endOf('day').toDate();
        break;
      case '6개월':
        startDate = now.clone().subtract(6, 'months').startOf('day').toDate();
        endDate = now.endOf('day').toDate();
        break;
      case '1년':
        startDate = now.clone().subtract(1, 'years').startOf('day').toDate();
        endDate = now.endOf('day').toDate();
        break;
      default:
        startDate = now.startOf('week').toDate();
        endDate = now.endOf('week').toDate();
    }
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

// 평균 운동 통계 조회
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    console.log('평균 통계 요청:', { userId });

    // 평균 운동 통계 계산
    const stats = await WorkoutLog.aggregate([
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
          totalWorkoutTimePerDay: {
            $sum: {
              $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60], // 밀리초 -> 분
            },
          },
          totalVolumePerDay: {
            $sum: {
              $multiply: ['$exercises.sets.weight', '$exercises.sets.reps'],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalWorkoutTime: { $sum: '$totalWorkoutTimePerDay' },
          totalVolume: { $sum: '$totalVolumePerDay' },
          totalDays: { $sum: 1 },
        },
      },
    ]);

    const totalWorkoutTime = stats[0]?.totalWorkoutTime || 0;
    const totalVolume = stats[0]?.totalVolume || 0;
    const totalDays = stats[0]?.totalDays || 0;

    // 평균 계산
    const averageWorkoutTime = totalDays > 0 ? totalWorkoutTime / totalDays : 0;
    const averageVolume = totalDays > 0 ? totalVolume / totalDays : 0;

    console.log('평균 통계 결과:', { averageWorkoutTime, averageVolume, totalDays });

    res.status(200).json({
      averageWorkoutTime: Math.round(averageWorkoutTime * 100) / 100, // 소수점 둘째 자리까지 반올림
      averageVolume: Math.round(averageVolume * 100) / 100, // 소수점 둘째 자리까지 반올림
      totalDays,
    });
  } catch (error) {
    console.error('평균 통계 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/workout/count', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    console.log('일별 운동 횟수 요청:', { userId });

    const dailyStats = await WorkoutLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          $expr: { $gte: ['$endTime', '$startTime'] }, // 운동 시작/종료 시간 유효성 검사
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$startTime' }, // 날짜 형식으로 그룹화
          },
          workoutCount: { $sum: 1 }, // 일별 운동 횟수 합산
        },
      },
      { $sort: { _id: 1 } }, // 날짜 순 정렬
    ]);

    console.log('일별 운동 횟수 결과:', dailyStats);

    res.status(200).json(dailyStats);
  } catch (error) {
    console.error('일별 운동 횟수 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// 볼륨 통계 조회 API
router.get('/workout/volume', authenticateToken, async (req, res) => {
  try {
    const { period } = req.query; // 'day', 'week', 'month' 중 하나
    const userId = req.user.id; // 인증된 사용자 ID

    console.log(`[GET /statistic/volume] 볼륨 통계 요청: 사용자 ID=${userId}, 기간=${period}`);

    // 운동 기록 가져오기
    const workoutLogs = await WorkoutLog.find({ user: userId });

    // 볼륨 데이터 계산
    const volumeData = workoutLogs.map((log) => {
      const date = dayjs(log.startTime).startOf(period).format('YYYY-MM-DD');
      const volume = log.exercises.reduce((totalVolume, exercise) => {
        const exerciseVolume = exercise.sets.reduce(
          (setVolume, set) => setVolume + set.weight * set.reps,
          0
        );
        return totalVolume + exerciseVolume;
      }, 0);
      return { date, volume };
    });

    // 날짜별 볼륨 합산
    const groupedData = volumeData.reduce((acc, curr) => {
      if (!acc[curr.date]) acc[curr.date] = 0;
      acc[curr.date] += curr.volume;
      return acc;
    }, {});

    // 결과 데이터 정리
    const result = Object.entries(groupedData).map(([date, volume]) => ({
      date,
      volume,
    }));

    console.log(`[GET /statistic/volume] 볼륨 통계 응답:`, result);

    res.status(200).json({ volumeData: result });
  } catch (error) {
    console.error(`[GET /statistic/volume] 볼륨 통계 오류:`, error.message);
    res.status(500).json({ message: '볼륨 통계 데이터를 가져오는 데 실패했습니다.', error: error.message });
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

// GET /api/statistic/weight/trends - 체중 변화 추이 반환
router.get('/weight/trends', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required.' });
    }

    console.log('체중 변화 추이 요청:', { userId, startDate, endDate });

    const weightTrends = await Weight.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $sort: { date: 1 }, // 날짜 순으로 정렬
      },
      {
        $project: {
          _id: 0, // _id 제외
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, // 날짜 형식 변환
          weight: 1,
        },
      },
    ]);

    console.log('체중 변화 추이 결과:', weightTrends);

    res.status(200).json(weightTrends);
  } catch (error) {
    console.error('체중 변화 추이 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/statistic/weight/summary - 최소, 최대, 평균 체중 반환
router.get('/weight/summary', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    console.log('체중 요약 데이터 요청:', { userId });

    const summary = await Weight.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          minWeight: { $min: '$weight' },
          maxWeight: { $max: '$weight' },
          avgWeight: { $avg: '$weight' },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({ minWeight: null, maxWeight: null, avgWeight: null });
    }

    const { minWeight, maxWeight, avgWeight } = summary[0];

    console.log('체중 요약 데이터 결과:', { minWeight, maxWeight, avgWeight });

    res.status(200).json({
      minWeight,
      maxWeight,
      avgWeight: avgWeight.toFixed(2), // 평균 체중 소수점 두 자리로 제한
    });
  } catch (error) {
    console.error('체중 요약 데이터 오류:', error.message);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
