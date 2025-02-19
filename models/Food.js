const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // 사용자 구분을 위한 user_id 추가
  food_name: { type: String, required: true }, // 음식 이름
  protein: { type: Number }, // 단백질 함량
  fat: { type: Number }, // 지방 함량
  saturated_fat: { type: Number }, // 포화지방산 함량
  trans_fat: { type: Number }, // 트랜스지방산 함량
  carbohydrates: { type: Number }, // 탄수화물 함량
  natrium: { type: Number }, // 나트륨 함량
  sugar: { type: Number }, // 당류 함량
  dietary_fiber: { type: Number }, // 식이섬유 함량
  calories: { type: Number }, // 칼로리
  serving_size: { type: String }, // 기준량 (예: 100g)
  created_at: { type: Date, default: Date.now }, // 기록일
  isCustom: { type: Boolean, default: false },
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
