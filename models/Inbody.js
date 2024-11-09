const mongoose = require('mongoose');

const InbodySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 사용자 ID
  date: { type: Date, required: true }, // 인바디 생성 날짜
  weight: { type: Number }, // 몸무게
  bodyFat: { type: Number }, // 체지방률
  muscleMass: { type: Number }, // 근육량
  waterPercentage: { type: Number }, // 수분 비율
  filePath: { type: String, required: true }, // 파일 저장 경로
  created_at: { type: Date, default: Date.now }, // 생성일
});

const Inbody = mongoose.models.Inbody || mongoose.model('Inbody', InbodySchema);

module.exports = Inbody;
