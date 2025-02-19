const mongoose = require('mongoose');

// const mealSchema = new mongoose.Schema({
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 사용자 ID
//   meal_type: { 
//     type: String, 
//     enum: ['breakfast', 'lunch', 'dinner', 'snack'], // 식사 유형
//     required: true 
//   }, 
//   foods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }], // 포함된 음식 ID
//   grams: [{ type: Number, required: true }], // 각 음식의 섭취량 (그램)
//   total_protein: { type: Number, default: 0 }, // 총 단백질
//   total_fat: { type: Number, default: 0 }, // 총 지방
//   total_carbohydrates: { type: Number, default: 0 }, // 총 탄수화물
//   total_saturated_fat: { type: Number, default: 0 }, // 총 포화지방산
//   total_trans_fat: { type: Number, default: 0 }, // 총 트랜스지방산
//   total_sugar: { type: Number, default: 0 }, // 총 당류
//   total_dietary_fiber: { type: Number, default: 0 }, // 총 식이섬유
//   total_calories: { type: Number, default: 0 }, // 총 칼로리
//   total_natrium: { type: Number, default: 0 }, // 총 나트륨
//   created_at: { type: Date, default: Date.now } // 기록일
// });

const mealSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 사용자 ID
  meal_type: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'snack'], // 식사 유형
    required: true 
  }, 
  foods: [{ _id: false, food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }, grams: Number }], // 포함된 음식 ID와 섭취량
  total_calories: { type: Number, default: 0 }, // 총 칼로리
  total_protein: { type: Number, default: 0 }, // 총 단백질
  total_fat: { type: Number, default: 0 }, // 총 지방
  total_carbohydrates: { type: Number, default: 0 }, // 총 탄수화물
  created_at: { type: Date, default: Date.now } // 기록일
});



const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
