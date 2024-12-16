const mongoose = require('mongoose');
const ExerciseName = require('../models/ExerciseName'); // ExerciseName 모델 경로
const Muscle = require('../models/Muscle'); // Muscle 모델 경로

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/wannabeFit')
  .then()
  .catch((error) => console.error('MongoDB connection error:', error));

// 기본 운동 이름 데이터 (운동 이름과 해당 부위 정보)
const defaultExercises = [
  { name: '스쿼트', muscles: ['하체'], user: null },
  { name: '레그 프레스', muscles: ['하체'], user: null },
  { name: '레그 컬', muscles: ['하체'], user: null },
  { name: '힙 쓰러스트', muscles: ['하체'], user: null },
  { name: '런지', muscles: ['하체'], user: null },
  { name: '카프 레이즈', muscles: ['하체'], user: null },

  { name: '벤치프레스', muscles: ['가슴'], user: null },
  { name: '푸시업', muscles: ['가슴'], user: null },
  { name: '인클라인 벤치프레스', muscles: ['가슴'], user: null },
  { name: '덤벨 플라이', muscles: ['가슴'], user: null },
  { name: '딥스', muscles: ['가슴'], user: null },
  { name: '케이블 크로스오버', muscles: ['가슴'], user: null },

  { name: '데드리프트', muscles: ['등'], user: null },
  { name: '풀업', muscles: ['등'], user: null },
  { name: '로우', muscles: ['등'], user: null },
  { name: '바벨로우', muscles: ['등'], user: null },
  { name: '시티드 로우', muscles: ['등'], user: null },
  { name: '턱걸이', muscles: ['등'], user: null },

  { name: '오버헤드 프레스', muscles: ['어깨'], user: null },
  { name: '레터럴 레이즈', muscles: ['어깨'], user: null },
  { name: '프론트 레이즈', muscles: ['어깨'], user: null },
  { name: '덤벨 숄더 프레스', muscles: ['어깨'], user: null },
  { name: '페이스 풀', muscles: ['어깨'], user: null },

  { name: '바이셉스 컬', muscles: ['팔'], user: null },
  { name: '트라이셉스 푸시다운', muscles: ['팔'], user: null },
  { name: '덤벨 컬', muscles: ['팔'], user: null },
  { name: '해머 컬', muscles: ['팔'], user: null },
  { name: '스컬 크러셔', muscles: ['팔'], user: null },

  { name: '버피', muscles: ['하체'], user: null },
  { name: '플랭크', muscles: ['가슴'], user: null },
  { name: '스쿼트 점프', muscles: ['하체'], user: null },
  { name: '스위밍', muscles: ['등'], user: null },
  { name: '케틀벨 스윙', muscles: ['하체'], user: null },
];

const populateExercises = async () => {
  try {
    for (const exercise of defaultExercises) {
      const { name, muscles, user } = exercise;

      // 각 운동 부위가 데이터베이스에 있는지 확인하고 없으면 추가
      const muscleIds = [];
      for (const muscleName of muscles) {
        let muscle = await Muscle.findOne({ name: muscleName });
        if (!muscle) {
          // 운동 부위가 없으면 새로 추가
          muscle = new Muscle({ name: muscleName });
          await muscle.save();
        }
        muscleIds.push(muscle._id); // 부위의 ObjectId 추가
      }

      // 이미 동일한 운동이 존재하는지 확인
      const existingExercise = await ExerciseName.findOne({ name });

      if (existingExercise) {
        console.log("기본 운동들이 저장되어있습니다.")
        break; // 이미 있으면 넘어가기
      }

      // 동일한 운동이 없으면 새로 추가
      const newExercise = new ExerciseName({
        name,
        muscles: muscleIds, // 운동 부위는 ObjectId 형태로 저장
        user,    // 기본 운동에 대해서는 user 필드를 null로 설정
      });
      await newExercise.save();
    }
    mongoose.disconnect(); // MongoDB 연결 종료
  } catch (error) {
    console.error('기본 운동을 추가하는 중 오류가 발생했습니다:', error);
    mongoose.disconnect(); // MongoDB 연결 종료
  }
};

populateExercises();
