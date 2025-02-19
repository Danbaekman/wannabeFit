const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const Food = require('../models/Food');
const authenticateToken = require('../middleware/authenticateToken');
const mongoose = require('mongoose'); //24.12.20 시헌 추가

router.post('/meal', authenticateToken, async (req, res) => {
  console.log('POST /meal route hit');
  console.log('Request Body:', req.body);

  const { meal_type, foods, created_at } = req.body;

  console.log('Foods Array:', req.body.foods);
  // 각 음식의 grams 값을 출력해보세요.
  foods.forEach(food => {
    console.log(`Food ID: ${food.food}, Grams: ${food.grams}`);
  });


  try {
    // foods 배열의 유효성 검사 및 영양성분 계산
    const processedFoods = await Promise.all(
      foods.map(async (food) => {
        if (!food.food) {
          console.error('Missing food in food item:', food);
          return null;
        }

        if (!mongoose.Types.ObjectId.isValid(food.food)) {
          console.error('Invalid food format:', food.food, 'in food item:', food);
          return null;
        }

        // Food 모델에서 원본 데이터 조회
        const foodData = await Food.findById(food.food);
        if (!foodData) {
          console.error('Food not found for ID:', food.food);
          return null;
        }

        // 섭취량에 따른 영양성분 계산
        const scaleFactor = food.grams / 100;
        return {
          food: foodData._id, // 음식 참조
          grams: food.grams,
          calories: foodData.calories * scaleFactor,
          protein: foodData.protein * scaleFactor,
          fat: foodData.fat * scaleFactor,
          carbohydrates: foodData.carbohydrates * scaleFactor,
        };
      })
    ).then((results) => results.filter(Boolean)); // null 값 제거

    console.log('Processed Foods after validation and calculation:', JSON.stringify(processedFoods, null, 2));

    // 기존 Meal 기록 확인
    let existingMeal = await Meal.findOne({
      user_id: req.user._id,
      meal_type,
      created_at: {
        $gte: new Date(new Date(created_at).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(created_at).setHours(23, 59, 59, 999)),
      },
    });

    // 총 영양성분 계산
    const totalValues = processedFoods.reduce(
      (totals, food) => {
        totals.total_calories += food.calories || 0;
        totals.total_protein += food.protein || 0;
        totals.total_fat += food.fat || 0;
        totals.total_carbohydrates += food.carbohydrates || 0;
        return totals;
      },
      { total_calories: 0, total_protein: 0, total_fat: 0, total_carbohydrates: 0 }
    );

    if (existingMeal) {
      // 기존 Meal에 음식 추가
      existingMeal.foods.push(...processedFoods);
      existingMeal.total_calories += totalValues.total_calories;
      existingMeal.total_protein += totalValues.total_protein;
      existingMeal.total_fat += totalValues.total_fat;
      existingMeal.total_carbohydrates += totalValues.total_carbohydrates;
      await existingMeal.save();
      return res.status(200).json({ message: 'Meal updated successfully.', meal: existingMeal });
    } else {
      // 새로운 Meal 생성
      const newMeal = new Meal({
        user_id: req.user._id,
        meal_type,
        foods: processedFoods,
        ...totalValues,
        created_at,
      });

      console.log('New Meal object:', newMeal);  // 저장하려는 meal 데이터 확인
      await newMeal.save();
      return res.status(201).json({ message: 'Meal created successfully.', meal: newMeal });
    }
  } catch (error) {
    console.error('Error saving meal:', error.message || error);
    res.status(500).json({ error: 'An error occurred while saving the meal.' });
  }
});


// Read meals for a specific date and meal type
// GET /meals
router.get('/meals', authenticateToken, async (req, res) => {
  const { date, meal_type } = req.query;

  try {
    const meals = await Meal.find({
      user_id: req.user._id,
      meal_type,
      created_at: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      }
    })
      .populate({
        path: 'foods.food',  // `food_id`를 populate
        select: 'food_name calories protein fat carbohydrates',  // 필요한 필드만 가져오기
      });
    console.log('Fetched Meals After Populate:', JSON.stringify(meals, null, 2));

    res.status(200).json(meals.length ? meals : []);
  } catch (error) {
    console.error('Error fetching meals:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put('/meal/:meal_id', authenticateToken, async (req, res) => {
  const { food_id, grams } = req.body; // food_id는 음식 아이디
  const meal_id = req.params.meal_id; // meal_id는 meals 문서의 _id

  console.log('food_id, grams', food_id, grams);
  console.log("meal_id:", meal_id);

  try {
    const existingMeal = await Meal.findById(meal_id);

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found.' });
    }

    // foods 배열 검증
    if (!existingMeal.foods || !Array.isArray(existingMeal.foods)) {
      console.error('Foods array is invalid or missing:', existingMeal.foods);
      return res.status(400).json({ error: 'Invalid foods array in meal.' });
    }

    // foods 배열 내에서 food_id를 찾기
    const foodIndex = existingMeal.foods.findIndex((food) => {
      if (!food || !food.food) {
        console.error('Invalid food entry in foods array:', food);
        return false;
      }
      return food.food.toString() === food_id; // food._id 대신 food.food 사용
    });

    if (foodIndex === -1) {
      return res.status(404).json({ error: 'Food not found in this meal.' });
    }

    // 해당 음식 가져오기
    const updatedFood = existingMeal.foods[foodIndex];
    const foodData = await Food.findById(updatedFood.food);

    if (!foodData) {
      console.error('Food data not found for ID:', updatedFood.food);
      return res.status(404).json({ error: 'Food data not found.' });
    }

    // 기존 음식의 칼로리 및 영양 성분 계산
    const oldScaleFactor = updatedFood.grams / 100;
    const oldCalories = foodData.calories * oldScaleFactor;
    const oldProtein = foodData.protein * oldScaleFactor;
    const oldFat = foodData.fat * oldScaleFactor;
    const oldCarbohydrates = foodData.carbohydrates * oldScaleFactor;

    // 새로 입력된 grams 기반으로 새 칼로리 및 영양 성분 계산
    const newScaleFactor = grams / 100;
    const newCalories = foodData.calories * newScaleFactor;
    const newProtein = foodData.protein * newScaleFactor;
    const newFat = foodData.fat * newScaleFactor;
    const newCarbohydrates = foodData.carbohydrates * newScaleFactor;

    // 총 영양 성분 업데이트
    existingMeal.total_calories += newCalories - oldCalories;
    existingMeal.total_protein += newProtein - oldProtein;
    existingMeal.total_fat += newFat - oldFat;
    existingMeal.total_carbohydrates += newCarbohydrates - oldCarbohydrates;

    // grams 값 업데이트
    existingMeal.foods[foodIndex].grams = grams;

    // 수정된 식사를 저장
    await existingMeal.save();

    console.log('Updated meal totals after modification:', {
      total_calories: existingMeal.total_calories,
      total_protein: existingMeal.total_protein,
      total_fat: existingMeal.total_fat,
      total_carbohydrates: existingMeal.total_carbohydrates,
    });

    res.status(200).json({ message: 'Meal updated successfully.', meal: existingMeal });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'An error occurred while updating the meal.' });
  }
});


router.delete('/:mealId/food/:foodId', authenticateToken, async (req, res) => {
  console.log('DELETE route reached with params:', req.params);

  const { mealId, foodId } = req.params;

  try {
    const meal = await Meal.findById(mealId);
    if (!meal) {
      console.log('Meal not found:', mealId);
      return res.status(404).json({ error: 'Meal not found' });
    }
    console.log('Meal foods:', meal.foods);

    // foods 배열 검증
    if (!meal.foods || !Array.isArray(meal.foods)) {
      console.error('Invalid foods array:', meal.foods);
      return res.status(400).json({ error: 'Invalid foods array in meal.' });
    }

    // foodId가 일치하는 항목 찾기
    const foodIndex = meal.foods.findIndex((food) => {
      if (!food) {
        console.error('Invalid food entry in foods array:', food);
        return false;
      }

      return (
        (food.food_id && food.food_id.equals(new mongoose.Types.ObjectId(foodId))) ||
        (food.food && food.food._id && food.food._id.equals(new mongoose.Types.ObjectId(foodId))) ||
        (food._id && food._id.equals(new mongoose.Types.ObjectId(foodId)))
      );
    });

    if (foodIndex === -1) {
      console.log('Food not found in meal:', foodId);
      return res.status(404).json({ error: 'Food not found in the meal.' });
    }

    // 삭제할 음식의 데이터
    const foodToRemove = meal.foods[foodIndex];
    const foodData = await Food.findById(foodToRemove.food);

    if (!foodData) {
      console.error('Food data not found for ID:', foodToRemove.food);
      return res.status(404).json({ error: 'Food data not found.' });
    }

    // 삭제 전 음식의 영양 성분 계산
    const scaleFactor = foodToRemove.grams / 100;
    const foodCalories = foodData.calories * scaleFactor;
    const foodProtein = foodData.protein * scaleFactor;
    const foodFat = foodData.fat * scaleFactor;
    const foodCarbohydrates = foodData.carbohydrates * scaleFactor;

    // 총 영양 성분 업데이트
    meal.total_calories -= foodCalories;
    meal.total_protein -= foodProtein;
    meal.total_fat -= foodFat;
    meal.total_carbohydrates -= foodCarbohydrates;

    console.log('Updated meal totals after deletion:', {
      total_calories: meal.total_calories,
      total_protein: meal.total_protein,
      total_fat: meal.total_fat,
      total_carbohydrates: meal.total_carbohydrates,
    });

    // 해당 음식 삭제
    meal.foods.splice(foodIndex, 1);

    // meal 저장
    await meal.save();
    console.log('Meal updated successfully');
    return res.status(200).json({ message: 'Food removed successfully', meal });
  } catch (error) {
    console.error('Error during DELETE request:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/meals-daily-summary', authenticateToken, async (req, res) => {
  const { date } = req.query;

  try {
    // 특정 날짜의 모든 식단 데이터 가져오기
    const meals = await Meal.find({
      user_id: req.user._id,
      created_at: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)), // 해당 날짜 00:00:00
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999)), // 해당 날짜 23:59:59
      },
    });

    // meal_type별 합산 + 전체 합산
    const summary = meals.reduce(
      (totals, meal) => {
        const type = meal.meal_type; // breakfast, lunch, dinner, snack
        if (!totals[type]) {
          totals[type] = {
            totalCalories: 0,
            totalProtein: 0,
            totalFat: 0,
            totalCarbohydrates: 0,
          };
        }

        // meal_type별 합산
        totals[type].totalCalories += meal.total_calories || 0;
        totals[type].totalProtein += meal.total_protein || 0;
        totals[type].totalFat += meal.total_fat || 0;
        totals[type].totalCarbohydrates += meal.total_carbohydrates || 0;

        // 전체 합산
        totals.totalCalories += meal.total_calories || 0;
        totals.totalProtein += meal.total_protein || 0;
        totals.totalFat += meal.total_fat || 0;
        totals.totalCarbohydrates += meal.total_carbohydrates || 0;

        return totals;
      },
      {
        breakfast: { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbohydrates: 0 },
        lunch: { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbohydrates: 0 },
        dinner: { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbohydrates: 0 },
        snack: { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbohydrates: 0 },
        totalCalories: 0,
        totalProtein: 0,
        totalFat: 0,
        totalCarbohydrates: 0,
      }
    );

    res.status(200).json(summary); // meal_type별 합산 결과 반환
  } catch (error) {
    console.error('Error fetching daily summary:', error.message);
    res.status(500).json({ error: 'Failed to fetch daily summary.' });
  }
});

// 📌 직접 입력된 음식 추가 API
router.post('/direct-add', authenticateToken, async (req, res) => {
  const { food_name, calories, carbohydrates, protein, fat, meal_type, created_at } = req.body;
  console.log('직접입력한 음식 :', req.body);

  if (!food_name || !calories || !carbohydrates || !protein || !fat) {
    return res.status(400).json({ error: '필수 입력값이 누락되었습니다.' });
  }

  try {
    // ✅ 1. 직접 입력한 음식 추가 (isCustom: true)
    const newFood = new Food({
      user_id: req.user._id,
      food_name,
      calories,
      carbohydrates,
      protein,
      fat,
      isCustom: true, // ✅ 직접 추가된 음식
    });

    const savedFood = await newFood.save();

    // ✅ 2. Meal에 추가
    let existingMeal = await Meal.findOne({
      user_id: req.user._id,
      meal_type,
      created_at: {
        $gte: new Date(new Date(created_at).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(created_at).setHours(23, 59, 59, 999)),
      },
    });

    const newFoodEntry = { food: savedFood._id, grams: 100 };
    if (existingMeal) {
      existingMeal.foods.push(newFoodEntry);
      existingMeal.total_calories += calories;
      existingMeal.total_protein += protein;
      existingMeal.total_fat += fat;
      existingMeal.total_carbohydrates += carbohydrates;
      await existingMeal.save();
    } else {
      const newMeal = new Meal({
        user_id: req.user._id,
        meal_type,
        foods: [newFoodEntry],
        total_calories: calories,
        total_protein: protein,
        total_fat: fat,
        total_carbohydrates: carbohydrates,
        created_at,
      });

      await newMeal.save();
    }

    res.status(201).json({ message: 'Meal created successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while saving the meal.' });
  }
});



module.exports = router;
