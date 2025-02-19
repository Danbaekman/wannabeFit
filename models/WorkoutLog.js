const mongoose = require('mongoose');

// 운동 세트 스키마
const setSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true, // 세트의 무게 (kg)
  },
  reps: {
    type: Number,
    required: true, // 반복 횟수
  },
  memo: {
    type: String,
    trim: true,
    default: '', // 선택적 메모
  },
}, { _id: false }); // 별도 ID 생성 방지

// 운동 기록 내 운동 이름 스키마
const exerciseRecordSchema = new mongoose.Schema({
  exerciseName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExerciseName', // 기존 ExerciseName 모델 참조
    required: true,
  },
  sets: [setSchema], // 운동 세트 배열
}, { _id: false });

// 운동 기록 스키마
const workoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User 모델 참조
    required: true,
  },
  muscles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Muscle', // 기존 Muscle 모델 참조
    required: true,
  }],
  exercises: [exerciseRecordSchema], // 운동 이름 및 세트 정보
  startTime: {
    type: Date,
    required: true, // 운동 시작 시간
  },
  endTime: {
    type: Date,
    required: true, // 운동 종료 시간
  },
  memo: {
    type: String,
    trim: true,
    default: '', // 선택적 메모 필드
  },
}, { timestamps: true });

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);

module.exports = WorkoutLog;
