const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Food = require('../models/Food'); // Food 모델 경로에 맞게 수정

// MongoDB 연결
mongoose
  .connect('mongodb://localhost:27017/wannabeFit')
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((error) => console.error('MongoDB 연결 오류:', error));

// CSV 파일 경로
const csvFilePath = './data/foodDB.csv'; // CSV 파일 경로 업데이트

// CSV 데이터를 MongoDB에 삽입하는 함수
async function insertFoodData() {
  const foodData = []; // CSV 데이터를 저장할 배열

  // CSV 파일 읽기
  fs.createReadStream(csvFilePath)
    .pipe(csv({
        mapHeaders: ({ header, index }) => header.trim().replace(/\s+/g, '_') // 공백을 제거하고 '_'로 대체
    }))
    .on('data', (row) => {
      // food_name과 serving_size가 존재하는지 확인하고, 공백을 제거
      if (!row.food_name || !row.serving_size || !row.food_name.trim() || !row.serving_size.trim()) {
        return; // 해당 행을 건너뜁니다.
      }
      // 숫자 필드 처리 (빈 값은 0으로 설정)
      row.calories = parseFloat(row.calories) || 0;
      row.protein = parseFloat(row.protein) || 0;
      row.fat = parseFloat(row.fat) || 0;
      row.carbohydrates = parseFloat(row.carbohydrates) || 0;
      row.sugar = parseFloat(row.sugar) || 0;
      row.dietary_fiber = parseFloat(row.dietary_fiber) || 0;
      row.saturated_fat = parseFloat(row.saturated_fat) || 0;
      row.trans_fat = parseFloat(row.trans_fat) || 0;
      row.natrium = parseFloat(row.natrium) || 0;

      foodData.push(row); // 유효한 데이터만 배열에 추가
    })
    .on('end', async () => {
      console.log(`CSV 파일에서 ${foodData.length}개의 유효한 데이터를 읽었습니다.`);

      // 데이터베이스에 동일한 food_name과 serving_size가 존재하면 삽입하지 않음
      const anyFoodExist = await Food.exists({
        $or: foodData.map((food) => ({
          food_name: food.food_name,
          serving_size: food.serving_size,
        })),
      });

      if (anyFoodExist) {
        console.log('Food 데이터가 이미 존재합니다.');
        mongoose.connection.close(); // 연결 종료
        return;
      }

      console.log('데이터 삽입을 시작합니다...');
      for (const food of foodData) {
        try {
          // DB에 데이터 삽입
          await Food.create({
            food_name: food.food_name,
            serving_size: food.serving_size,
            calories: food.calories,
            protein: food.protein,
            fat: food.fat,
            carbohydrates: food.carbohydrates,
            sugar: food.sugar,
            dietary_fiber: food.dietary_fiber,
            saturated_fat: food.saturated_fat,
            trans_fat: food.trans_fat,
            natrium: food.natrium,
            user_id: null, // 기본 제공 데이터는 user_id가 null
          });
        } catch (error) {
          console.error(`삽입 중 오류 발생: ${food.food_name}`, error);
        }
      }

      console.log('데이터 삽입이 완료되었습니다.');
      mongoose.connection.close(); // MongoDB 연결 종료
    });
}

// 삽입 함수 실행
insertFoodData();
