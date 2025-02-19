const mongoose = require('mongoose');

// 운동 이름 모델
const exerciseNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true // 중복된 운동 이름 방지
  },
  muscles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Muscle', // 운동 이름과 연결된 운동 부위
    required: true
  }],
  user: { // 운동 이름을 추가한 사용자
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // 기본 제공 운동일 경우 null
  },
  isCustom: { // 사용자 정의 여부
    type: Boolean,
    default: false // 기본 제공 운동은 false, 사용자 정의 운동은 true
  }
}, { timestamps: true });

const ExerciseName = mongoose.model('ExerciseName', exerciseNameSchema);

module.exports = ExerciseName;
