const express = require('express');
const router = express.Router();
const WorkoutLog = require('../models/WorkoutLog'); // WorkoutLog 모델
const authenticateToken = require('../middleware/authenticateToken'); // 인증 미들웨어

// 운동 기록 생성 (Create)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {  muscles, exercises, startTime, endTime, memo } = req.body;
    console.log('📥 Received workout data:', JSON.stringify(req.body, null, 2)); // 여기서 확인

    console.log(`[POST /] 운동 기록 생성 요청: 사용자 ID=${req.user.id}, 요청 데이터=`, req.body);

    const workoutLog = new WorkoutLog({
      user: req.user.id, // 인증된 사용자 ID
      muscles,
      exercises,
      startTime,
      endTime,
      memo,
    });

    const savedWorkoutLog = await workoutLog.save();

    console.log(`[POST /] 운동 기록 생성 성공:`, savedWorkoutLog);

    res.status(201).json({ message: '운동 기록이 생성되었습니다.', workoutLog: savedWorkoutLog });
  } catch (error) {
    console.error(`[POST /] 운동 기록 생성 실패:`, error.message);
    res.status(500).json({ message: '운동 기록 생성 실패', error: error.message });
  }
});

// 특정 사용자의 운동 기록 전체 조회 (Read All)
router.get('/', authenticateToken, async (req, res) => {
  try {

    const workoutLogs = await WorkoutLog.find({ user: req.user.id }) // 사용자 ID 기준으로 조회
      .populate('muscles', 'name') // Muscle 이름만 가져옴
      .populate('exercises.exerciseName', 'name') // ExerciseName 이름만 가져옴
      .lean(); // JSON 형태로 반환

    // 필요 시 totalSets와 totalTime 추가 처리
    const result = workoutLogs.map((log) => {
      const totalSets = log.exercises.reduce((setSum, exercise) => {
        return setSum + (exercise.sets ? exercise.sets.length : 0); // sets의 길이를 합산
      }, 0);

      const totalTime = (new Date(log.endTime) - new Date(log.startTime)) / (1000 * 60); // 총 운동 시간 계산

      return {
        ...log,
        memo: log.memo || '',
        exercises: log.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets || [], // sets 배열 포함
        })),
        totalSets,
        totalTime,
      };
    });

console.log(`[GET /] 운동 기록 전체 조회 성공:`, JSON.stringify(result, null, 2));
res.status(200).json({ workoutLogs: result });

  } catch (error) {
    console.error(`[GET /] 운동 기록 조회 실패:`, error.message);
    res.status(500).json({ message: '운동 기록 조회 실패', error: error.message });
  }
});

// 특정 운동 기록 단일 조회 (Read One)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[GET /:id] 운동 기록 단일 조회 요청: 사용자 ID=${req.user.id}, 기록 ID=${id}`);

    const workoutLog = await WorkoutLog.findOne({ _id: id, user: req.user.id }) // ID와 사용자 일치
      .populate('muscles', 'name')
      .populate('exercises.exerciseName', 'name');

    if (!workoutLog) {
      console.warn(`[GET /:id] 운동 기록 단일 조회 실패: 기록 ID=${id} 존재하지 않음`);
      return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
    }

    console.log(`[GET /:id] 운동 기록 단일 조회 성공:`, workoutLog);

    res.status(200).json({ workoutLog });
  } catch (error) {
    console.error(`[GET /:id] 운동 기록 조회 실패:`, error.message);
    res.status(500).json({ message: '운동 기록 조회 실패', error: error.message });
  }
});

// 운동 기록 수정 (Update)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { muscles, exercises, startTime, endTime } = req.body;

    console.log(`[PUT /:id] 운동 기록 수정 요청: 사용자 ID=${req.user.id}, 기록 ID=${id}, 요청 데이터=`, req.body);

    const updatedWorkoutLog = await WorkoutLog.findOneAndUpdate(
      { _id: id, user: req.user.id }, // ID와 사용자 일치 조건
      { muscles, exercises, startTime, endTime },
      { new: true } // 수정 후 새로운 데이터 반환
    );

    if (!updatedWorkoutLog) {
      console.warn(`[PUT /:id] 운동 기록 수정 실패: 기록 ID=${id} 존재하지 않음`);
      return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
    }

    console.log(`[PUT /:id] 운동 기록 수정 성공:`, updatedWorkoutLog);

    res.status(200).json({ message: '운동 기록이 수정되었습니다.', workoutLog: updatedWorkoutLog });
  } catch (error) {
    console.error(`[PUT /:id] 운동 기록 수정 실패:`, error.message);
    res.status(500).json({ message: '운동 기록 수정 실패', error: error.message });
  }
});

// 운동 기록 삭제 (Delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[DELETE /:id] 운동 기록 삭제 요청: 사용자 ID=${req.user.id}, 기록 ID=${id}`);

    const deletedWorkoutLog = await WorkoutLog.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deletedWorkoutLog) {
      console.warn(`[DELETE /:id] 운동 기록 삭제 실패: 기록 ID=${id} 존재하지 않음`);
      return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
    }

    console.log(`[DELETE /:id] 운동 기록 삭제 성공:`, deletedWorkoutLog);

    res.status(200).json({ message: '운동 기록이 삭제되었습니다.' });
  } catch (error) {
    console.error(`[DELETE /:id] 운동 기록 삭제 실패:`, error.message);
    res.status(500).json({ message: '운동 기록 삭제 실패', error: error.message });
  }
});

module.exports = router;
