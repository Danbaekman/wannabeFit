const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');  // Path to your Exercise model

// MongoDB에 연결
mongoose.connect('mongodb://localhost:27017/wannabeFit')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Default exercises data
const defaultExercises = [
  // 하체 운동 (Leg Exercises)
  { name: '스쿼트', muscle: '하체', user: null },
  { name: '레그 프레스', muscle: '하체', user: null },
  { name: '레그 컬', muscle: '하체', user: null },
  { name: '힙 쓰러스트', muscle: '하체', user: null },
  { name: '런지', muscle: '하체', user: null },
  { name: '카프 레이즈', muscle: '하체', user: null },

  // 가슴 운동 (Chest Exercises)
  { name: '벤치프레스', muscle: '가슴', user: null },
  { name: '푸시업', muscle: '가슴', user: null },
  { name: '인클라인 벤치프레스', muscle: '가슴', user: null },
  { name: '덤벨 플라이', muscle: '가슴', user: null },
  { name: '딥스', muscle: '가슴', user: null },
  { name: '케이블 크로스오버', muscle: '가슴', user: null },

  // 등 운동 (Back Exercises)
  { name: '데드리프트', muscle: '등', user: null },
  { name: '풀업', muscle: '등', user: null },
  { name: '로우', muscle: '등', user: null },
  { name: '바벨로우', muscle: '등', user: null },
  { name: '시티드 로우', muscle: '등', user: null },
  { name: '턱걸이', muscle: '등', user: null },

  // 어깨 운동 (Shoulder Exercises)
  { name: '오버헤드 프레스', muscle: '어깨', user: null },
  { name: '레터럴 레이즈', muscle: '어깨', user: null },
  { name: '프론트 레이즈', muscle: '어깨', user: null },
  { name: '덤벨 숄더 프레스', muscle: '어깨', user: null },
  { name: '페이스 풀', muscle: '어깨', user: null },

  // 팔 운동 (Arm Exercises)
  { name: '바이셉스 컬', muscle: '팔', user: null },
  { name: '트라이셉스 푸시다운', muscle: '팔', user: null },
  { name: '덤벨 컬', muscle: '팔', user: null },
  { name: '해머 컬', muscle: '팔', user: null },
  { name: '스컬 크러셔', muscle: '팔', user: null },

  // 추가 운동 (Other Exercises)
  { name: '버피', muscle: '하체', user: null },
  { name: '플랭크', muscle: '가슴', user: null },
  { name: '스쿼트 점프', muscle: '하체', user: null },
  { name: '스위밍', muscle: '등', user: null },
  { name: '케틀벨 스윙', muscle: '하체', user: null },
];

const populateExercises = async () => {
  try {
    let duplicateFound = false;
    for (const exercise of defaultExercises) {
      const { name, muscle } = exercise;

      // 이미 동일한 운동이 존재하는지 확인
      const existingExercise = await Exercise.findOne({ name, muscle });

      if (existingExercise) {
        duplicateFound = true;
        console.log(`운동 "${name}"은 이미 존재합니다.`);
        break; // 중복이 있으면 더 이상 진행하지 않고 종료
      }

      // 동일한 운동이 없으면 새로 추가
      const newExercise = new Exercise({
        name,
        muscle,
        user: null // 기본 운동에 대해서는 user 필드를 null로 설정
      });
      await newExercise.save();
      console.log(`운동 "${name}"이 추가되었습니다.`);
    }

    if (!duplicateFound) {
      console.log('기본 운동이 성공적으로 추가되었습니다.');
    }

    mongoose.disconnect(); // MongoDB 연결 종료
  } catch (error) {
    console.error('기본 운동을 추가하는 중 오류가 발생했습니다:', error);
    mongoose.disconnect(); // MongoDB 연결 종료
  }
};

populateExercises();
