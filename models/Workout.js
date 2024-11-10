const mongoose = require('mongoose');

const exerciseInstanceSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true // 운동은 반드시 존재해야 함
  },
  sets: {
    type: Number,
    required: true,
    min: 1 // 최소 세트 수는 1
  },
  reps: {
    type: Number,
    min: 1 // 최소 반복 횟수는 1
  },
  weight: {
    type: Number,
    default: 0,
    min: 0 // 무게는 0 이상
  },
  duration: {
    type: Number, // 시간 기반 운동의 경우 (예: 유산소)
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true // 메모에서 불필요한 공백을 제거
  }
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 사용자의 ID와 연결
    required: true
  },
  routineName: { // 운동 루틴 이름
    type: String,
    required: true
  },
  exercises: [exerciseInstanceSchema], // 운동 세부 사항 (운동 인스턴스 배열)
  start_time: {  // 운동 시작 시간
    type: Date,
    required: true
  },
  end_time: {    // 운동 종료 시간
    type: Date,
    required: true
  },
  date: {
    type: Date,
    default: Date.now // 운동이 기록된 날짜 (기본값: 현재 시간)
  },
  generalMemo: { // 운동에 대한 전반적인 메모
    type: String,
    trim: true
  }
}, { 
  timestamps: true // createdAt, updatedAt 자동 생성
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
