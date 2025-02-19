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

// 운동 부위 삭제 시 연결된 세부 항목(ExerciseName)도 삭제
muscleSchema.pre('findOneAndDelete', async function (next) {
  const muscleId = this.getQuery()._id; // 삭제될 muscle ID
  await mongoose.model('ExerciseName').deleteMany({ muscles: muscleId }); // 연결된 세부 항목 삭제
  next();
});

const Muscle = mongoose.model('Muscle', muscleSchema);

module.exports = Muscle;
