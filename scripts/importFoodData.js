const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Food = require('../models/Food'); // Food 모델 경로에 맞게 수정

// MongoDB 연결
mongoose
  .connect('mongodb://localhost:27017/wannabeFit')
  .then()
  .catch((error) => console.error('MongoDB connection error:', error));


// CSV 파일 경로
const csvFilePath = './data/foodDB.csv'; // 파일 경로 업데이트

// CSV 데이터베이스 삽입 함수
async function insertFoodData() {
  const foodData = []; // CSV 데이터를 저장할 배열

  // CSV 파일 읽기
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      foodData.push(row); // CSV 각 행 데이터를 foodData 배열에 추가
    })
    .on('end', async () => {
      //console.log(`CSV 파일에서 ${foodData.length}개의 데이터를 읽었습니다.`);

      // 데이터베이스에 food_name이 하나라도 존재하면 삽입을 하지 않음
      const anyFoodExist = await Food.exists({
        food_name: { $in: foodData.map((food) => food.food_name) },
      });

      if (anyFoodExist) {
        console.log('Food 데이터가 이미 존재합니다.');
        mongoose.connection.close(); // 연결 종료
        return;
      }

      console.log('데이터 삽입을 시작합니다...');
      for (const food of foodData) {
        try {
          // DB에 이미 존재하는지 확인 (위에서 이미 존재 여부 체크했으므로 이 단계는 불필요)
          // const existingFood = await Food.findOne({ food_name: food.food_name });

          // 존재하지 않으면 삽입
          await Food.create({
            user_id: food.user_id, // 필요한 경우 user_id를 적절히 설정
            food_name: food.food_name,
            protein: parseFloat(food.protein) || 0,
            fat: parseFloat(food.fat) || 0,
            saturated_fat: parseFloat(food.saturated_fat) || 0,
            trans_fat: parseFloat(food.trans_fat) || 0,
            carbohydrates: parseFloat(food.carbohydrates) || 0,
            natrium: parseFloat(food.natrium) || 0,
            sugar: parseFloat(food.sugar) || 0,
            dietary_fiber: parseFloat(food.dietary_fiber) || 0,
            calories: parseFloat(food.calories) || 0,
            serving_size: food.serving_size,
          });
          console.log(`삽입됨: ${food.food_name}`);
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
