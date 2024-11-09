const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User 모델과 연결
  accessToken: { type: String, required: true }, // 액세스 토큰
  refreshToken: { type: String }, // 리프레시 토큰
  tokenType: { type: String }, // 토큰 타입
  expiresAt: { type: Date }, // 토큰 만료 시간
  created_at: { type: Date, default: Date.now }, // 생성일
  updated_at: { type: Date, default: Date.now } // 수정일
});

// Ensure that Token model is not recompiled
const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);

module.exports = Token;
