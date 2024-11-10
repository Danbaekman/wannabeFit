// routes/exercises.js
const express = require('express');
const Exercise = require('../models/Exercise');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // 인증 미들웨어 추가

// 운동 목록 가져오기 (Read)
router.get('/exercises', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // 사용자 ID
    console.log(`Fetching exercises for user: ${userId}`); // 로그 추가
    const exercises = await Exercise.find({
      $or: [
        { user: userId }, // 사용자가 등록한 운동
        { user: null }     // 기본 제공 운동
      ]
    });

    console.log(`Found ${exercises.length} exercises`); // 찾은 운동 갯수 로그
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error); // 에러 로그
    res.status(500).json({ message: "운동을 가져오는 중 오류가 발생했습니다." });
  }
});

// 운동 등록하기 (Create)
router.post('/exercises', authenticateToken, async (req, res) => {
  const { name, muscle, customMuscle } = req.body;
  console.log(`Registering new exercise: ${name}`); // 로그 추가

  // 운동명과 부위 필수 입력 체크
  if (!name) {
    console.log("Error: 운동명은 필수 입력 항목입니다."); // 오류 로그
    return res.status(400).json({ message: "운동명은 필수 입력 항목입니다." });
  }

  // muscle과 customMuscle 중 하나만 있어야 함
  if (!muscle && !customMuscle) {
    console.log("Error: 운동 부위는 'muscle' 또는 'customMuscle' 중 하나를 입력해야 합니다."); // 오류 로그
    return res.status(400).json({ message: "운동 부위는 'muscle' 또는 'customMuscle' 중 하나를 입력해야 합니다." });
  }

  if (muscle && customMuscle) {
    console.log("Error: 'muscle'과 'customMuscle'은 둘 중 하나만 입력할 수 있습니다."); // 오류 로그
    return res.status(400).json({ message: "'muscle'과 'customMuscle'은 둘 중 하나만 입력할 수 있습니다." });
  }

  try {
    const newExercise = new Exercise({
      name,
      muscle,
      customMuscle,
      user: req.user.id
    });

    await newExercise.save();
    console.log(`Exercise '${name}' registered successfully`); // 성공 로그
    res.status(201).json({ message: "운동이 성공적으로 등록되었습니다.", exercise: newExercise });
  } catch (error) {
    console.error("Error during exercise registration:", error); // 에러 로그
    res.status(500).json({ message: "운동 등록 중 오류가 발생했습니다.", error: error.message });
  }
});

// 운동 수정하기 (Update)
router.put('/exercises/:id', authenticateToken, async (req, res) => {
  const { name, muscle, customMuscle } = req.body;
  const exerciseId = req.params.id;
  console.log(`Updating exercise with ID: ${exerciseId}`); // 로그 추가

  // muscle과 customMuscle 중 하나만 있어야 함
  if (!muscle && !customMuscle) {
    console.log("Error: 운동 부위는 'muscle' 또는 'customMuscle' 중 하나를 입력해야 합니다."); // 오류 로그
    return res.status(400).json({ message: "운동 부위는 'muscle' 또는 'customMuscle' 중 하나를 입력해야 합니다." });
  }

  if (muscle && customMuscle) {
    console.log("Error: 'muscle'과 'customMuscle'은 둘 중 하나만 입력할 수 있습니다."); // 오류 로그
    return res.status(400).json({ message: "'muscle'과 'customMuscle'은 둘 중 하나만 입력할 수 있습니다." });
  }

  try {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      console.log(`Exercise with ID ${exerciseId} not found`); // 오류 로그
      return res.status(404).json({ message: "운동을 찾을 수 없습니다." });
    }

    // 수정할 수 있는 항목들만 업데이트
    exercise.name = name || exercise.name;
    exercise.muscle = muscle || exercise.muscle;
    exercise.customMuscle = customMuscle || exercise.customMuscle;

    await exercise.save();
    console.log(`Exercise '${exercise.name}' updated successfully`); // 성공 로그
    res.status(200).json({ message: "운동이 성공적으로 업데이트되었습니다.", exercise });
  } catch (error) {
    console.error("Error during exercise update:", error); // 에러 로그
    res.status(500).json({ message: "운동 수정 중 오류가 발생했습니다.", error: error.message });
  }
});

// 운동 삭제하기 (Delete)
router.delete('/exercises/:id', authenticateToken, async (req, res) => {
  const exerciseId = req.params.id;
  console.log(`Deleting exercise with ID: ${exerciseId}`); // 로그 추가

  try {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      console.log(`Exercise with ID ${exerciseId} not found`); // 오류 로그
      return res.status(404).json({ message: "운동을 찾을 수 없습니다." });
    }

    // 운동 삭제
    await exercise.remove();
    console.log(`Exercise with ID ${exerciseId} deleted successfully`); // 성공 로그
    res.status(200).json({ message: "운동이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("Error during exercise deletion:", error); // 에러 로그
    res.status(500).json({ message: "운동 삭제 중 오류가 발생했습니다.", error: error.message });
  }
});

module.exports = router;
