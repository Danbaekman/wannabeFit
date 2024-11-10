const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  muscle: {
    type: String,
    enum: [
      '하체', '가슴', '등', '어깨', '팔', // 기본 제공되는 부위
    ],
    required: true,
    trim: true
  },

  customMuscle: { // 사용자가 자율적으로 추가한 부위 처리
    type: String,
    trim: true
  },

  user: { // 사용자가 추가한 운동을 식별
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // 기본 운동일 경우 user 필드를 null로 설정
  }

}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
