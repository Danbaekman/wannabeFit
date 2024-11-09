const mongoose = require('mongoose');

// 활동 수준을 정의하기 위한 Enum
const ActivityLevels = {
  SEDENTARY: 'Sedentary', // 활동이 적거나 운동을 안하는 경우
  LIGHT: 'Light', // 가벼운 활동 및 운동을 하는 경우(1~3일/1주)
  MODERATE: 'Moderate', // 보통(3~5일/1주)
  VERY_ACTIVE: 'Very Active', // 적극적인 활동 및 운동(6~7일/1주)
  EXTRA_ACTIVE: 'Extra Active' // 매우 활동적인 경우
};

// 목표 정의
const Goals = {
  BULK: 'bulk', // 근육 증가
  DIET: 'diet', // 다이어트
  MAINTAIN: 'maintain' // 유지
};

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true }, // 사용자 이메일
  name: { type: String }, // 사용자 이름
  gender: { type: String }, // 성별
  height: { type: Number }, // 키
  weight: { type: Number }, // 몸무게
  age: { type: Number }, // 나이
  bmr: { type: Number }, // 기초대사량
  tdee: { type: Number }, // 활동 대사량
  targetWeight : {type : Number}, // 목표 몸무게
  exerciseFrequency: { type: Number, enum: Object.values(ActivityLevels) }, // 운동 빈도
  recommended_protein: { type: Number }, // 권장 단백질 섭취량
  recommended_fat: { type: Number }, // 권장 지방 섭취량
  recommended_carbs: { type: Number }, // 권장 탄수화물 섭취량
  goal: { type: String, enum: Object.values(Goals) }, // 목표
  weeksToGoal: { type: Number, default: 0 }, // 목표까지 걸리는 주 수
  target_calories: { type: Number, default: 0 }, // 목표 칼로리
  created_at: { type: Date, default: Date.now }, // 가입일
  updated_at: { type: Date, default: Date.now } // 정보 수정일
});


// Ensure that User model is not recompiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
