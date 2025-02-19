const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const calculateBMRAndTDEE = require('../utils/calculateBMR'); 
const multer = require('multer');
const fs = require('fs');      // ⬅ fs 추가
const path = require('path');  // ⬅ path 추가



const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정 (로컬 파일 저장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/upload-image', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '파일이 없습니다.' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // ✅ 절대 경로 반환
    const userId = req.user.id; // ✅ JWT에서 유저 ID 가져오기

    // ✅ DB 업데이트 (사용자의 프로필 이미지 필드 변경)
    await User.findByIdAndUpdate(userId, { profileImage: fileUrl });

    res.json({ profileImage: fileUrl }); // ✅ 클라이언트에 이미지 경로 반환
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    res.status(500).json({ error: '이미지 업로드 실패' });
  }
});

// 활동 수준을 매핑하는 함수
const mapExerciseFrequencyToActivityLevel = (exerciseFrequency) => {
  if (exerciseFrequency >= 0 && exerciseFrequency <= 1) return 0; // 활동 적음
  if (exerciseFrequency === 2 || exerciseFrequency === 3) return 1; // 약간 활동적
  if (exerciseFrequency === 4 || exerciseFrequency === 5) return 2; // 보통 활동적
  if (exerciseFrequency === 6) return 3; // 활동적
  if (exerciseFrequency === 7) return 4; // 매우 활동적
  throw new Error('Invalid exercise frequency');
};


// 25.01.15 시헌 수정
// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // 비밀번호 제외
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 25.01.15 시헌 수정
// Update user profile
router.put('/profile-update', authenticateToken, async (req, res) => {
  try {
    const { name, gender, height, weight, birthdate, targetWeight, exerciseFrequency, goal } = req.body;
    console.log('Received exerciseFrequency:', exerciseFrequency);

    // user를 선언 후 바로 값을 가져옵니다.
    const user = await User.findById(req.user._id);
    if (!user) {
      console.error('User not found.');
      return res.status(404).json({ error: 'User not found.' });
    }

    // 나이 계산 (user 값을 제대로 확인 후 사용)
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthdate || user.birthdate || '1970-01-01').getFullYear();
    const age = currentYear - birthYear;

    // exerciseFrequency 값을 activityLevel로 매핑
    const activityLevel = mapExerciseFrequencyToActivityLevel(exerciseFrequency || user.exerciseFrequency);

    // BMR, TDEE 및 관련 데이터 재계산
    const { bmr, tdee, totalCalories, macros, weeksToGoal } = calculateBMRAndTDEE(
      gender || user.gender,
      weight || user.weight,
      height || user.height,
      age,
      activityLevel, // 수정된 부분
      goal || user.goal,
      targetWeight || user.targetWeight
    );

    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        gender: gender || user.gender,
        height: height || user.height,
        weight: weight || user.weight,
        birthdate: birthdate || user.birthdate,
        bmr,
        tdee,
        age,
        targetWeight: targetWeight || user.targetWeight,
        exerciseFrequency: exerciseFrequency || user.exerciseFrequency,
        recommended_protein: macros.protein,
        recommended_fat: macros.fat,
        recommended_carbs: macros.carbs,
        goal: goal || user.goal,
        weeksToGoal,
        target_calories: totalCalories,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error('Failed to update user.');
      return res.status(500).json({ error: 'Failed to update user.' });
    }

    console.log('User updated successfully:', updatedUser);
    res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// Delete user profile
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
