const mongoose = require('mongoose');

// 운동 부위 모델
const muscleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true // 중복된 부위 이름 방지
  },
  isCustom: {
    type: Boolean,
    default: false // 기본 제공 부위는 false, 사용자 정의 부위는 true
  },
  user: { // 운동 부위를 추가한 사용자
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // 기본 제공 부위일 경우 null
  }
}, { timestamps: true });

const Muscle = mongoose.model('Muscle', muscleSchema);

module.exports = Muscle;
