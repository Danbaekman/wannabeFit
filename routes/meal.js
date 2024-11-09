const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const Food = require('../models/Food');
const authenticateToken = require('../middleware/authenticateToken');


// Create a new meal or use existing one
router.post('/meal', authenticateToken, async (req, res) => {
  const { meal_type, food_ids, created_at, grams } = req.body;
  const createdAtDate = created_at ? new Date(created_at) : new Date();

  try {
    let existingMeal = await Meal.findOne({
      user_id: req.user._id,
      meal_type,
      created_at: {
        $gte: new Date(createdAtDate.setHours(0, 0, 0, 0)),
        $lt: new Date(createdAtDate.setHours(23, 59, 59, 999)),
      }
    });
    
    if (existingMeal) {
      
      // If meal exists, append food_ids and grams
      existingMeal.foods.push(...food_ids); // Append new foods
      existingMeal.grams.push(...grams); // Append new grams

      const foods = await Food.find({ '_id': { $in: food_ids } });
      let totals = calculateTotals(foods);

      // Update totals for the existing meal
      existingMeal.total_protein += totals.total_protein;
      existingMeal.total_fat += totals.total_fat;
      existingMeal.total_saturated_fat += totals.total_saturated_fat;
      existingMeal.total_trans_fat += totals.total_trans_fat;
      existingMeal.total_carbohydrates += totals.total_carbohydrates;
      existingMeal.total_sugar += totals.total_sugar;
      existingMeal.total_dietary_fiber += totals.total_dietary_fiber;
      existingMeal.total_calories += totals.total_calories;
      existingMeal.total_natrium += totals.total_natrium;

      await existingMeal.save();
      return res.status(200).json({ message: 'Meal updated successfully.', meal: existingMeal });
    } else {
      // Creating a new meal
      const foods = await Food.find({ '_id': { $in: food_ids } });
      let totals = {
        total_protein: 0,
        total_fat: 0,
        total_saturated_fat: 0,
        total_trans_fat: 0,
        total_carbohydrates: 0,
        total_sugar: 0,
        total_dietary_fiber: 0,
        total_calories: 0,
        total_natrium: 0
      };

      foods.forEach((food, index) => {
        const servingSize = food.serving_size ? parseFloat(food.serving_size) : 100;
        const scaleFactor = grams[index] / servingSize;

        totals.total_protein += (food.protein || 0) * scaleFactor;
        totals.total_fat += (food.fat || 0) * scaleFactor;
        totals.total_saturated_fat += (food.saturated_fat || 0) * scaleFactor;
        totals.total_trans_fat += (food.trans_fat || 0) * scaleFactor;
        totals.total_carbohydrates += (food.carbohydrates || 0) * scaleFactor;
        totals.total_sugar += (food.sugar || 0) * scaleFactor;
        totals.total_dietary_fiber += (food.dietary_fiber || 0) * scaleFactor;
        totals.total_calories += (food.calories || 0) * scaleFactor;
        totals.total_natrium += (food.natrium || 0) * scaleFactor;
      });

      const newMeal = new Meal({
        user_id: req.user._id,
        meal_type,
        foods: food_ids,
        grams: grams, // Make sure to initialize grams
        ...totals,
        created_at: created_at ? new Date(created_at) : Date.now()
      });
      
      await newMeal.save();
      return res.status(201).json({ message: 'Meal created successfully.', meal: newMeal });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Read meals for a specific date and meal type
router.get('/meals', authenticateToken, async (req, res) => {
  const { date, meal_type } = req.query;

  try {
    const meals = await Meal.find({
      user_id: req.user._id,
      meal_type,
      created_at: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) // 다음 날까지
      }
    }).populate('foods');

    res.status(200).json(meals.length ? meals : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a meal with optional created_at date
router.put('/meal/:id', authenticateToken, async (req, res) => {
  const { meal_type, food_ids, created_at } = req.body;

  try {
    const existingMeal = await Meal.findById(req.params.id).populate('foods');

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found.' });
    }

    // 기존 foods와 새로운 food_ids 비교하여 추가 및 삭제된 음식 구분
    const oldFoodIds = existingMeal.foods.map(food => food._id.toString());
    const newFoodIds = food_ids.map(id => id.toString());

    const removedFoodIds = oldFoodIds.filter(id => !newFoodIds.includes(id));
    const addedFoodIds = newFoodIds.filter(id => !oldFoodIds.includes(id));

    // 총합 계산
    const removedFoods = await Food.find({ '_id': { $in: removedFoodIds } });
    const addedFoods = await Food.find({ '_id': { $in: addedFoodIds } });

    const removedTotals = calculateTotals(removedFoods);
    const addedTotals = calculateTotals(addedFoods);

    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      {
        meal_type,
        foods: food_ids,
        total_protein: existingMeal.total_protein - removedTotals.total_protein + addedTotals.total_protein,
        total_fat: existingMeal.total_fat - removedTotals.total_fat + addedTotals.total_fat,
        total_saturated_fat: existingMeal.total_saturated_fat - removedTotals.total_saturated_fat + addedTotals.total_saturated_fat,
        total_trans_fat: existingMeal.total_trans_fat - removedTotals.total_trans_fat + addedTotals.total_trans_fat,
        total_carbohydrates: existingMeal.total_carbohydrates - removedTotals.total_carbohydrates + addedTotals.total_carbohydrates,
        total_sugar: existingMeal.total_sugar - removedTotals.total_sugar + addedTotals.total_sugar,
        total_dietary_fiber: existingMeal.total_dietary_fiber - removedTotals.total_dietary_fiber + addedTotals.total_dietary_fiber,
        total_calories: existingMeal.total_calories - removedTotals.total_calories + addedTotals.total_calories,
        total_natrium: existingMeal.total_natrium - removedTotals.total_natrium + addedTotals.total_natrium,
        created_at: created_at ? new Date(created_at) : existingMeal.created_at // created_at 업데이트
      },
      { new: true }
    );

    res.status(200).json({ message: 'Meal updated successfully.', meal: updatedMeal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 영양 성분 총합 계산 함수
function calculateTotals(foods) {
  return foods.reduce((totals, food) => {
    totals.total_protein += food.protein || 0;
    totals.total_fat += food.fat || 0;
    totals.total_saturated_fat += food.saturated_fat || 0;
    totals.total_trans_fat += food.trans_fat || 0;
    totals.total_carbohydrates += food.carbohydrates || 0;
    totals.total_sugar += food.sugar || 0;
    totals.total_dietary_fiber += food.dietary_fiber || 0;
    totals.total_calories += food.calories || 0;
    totals.total_natrium += food.natrium || 0;
    return totals;
  }, {
    total_protein: 0,
    total_fat: 0,
    total_saturated_fat: 0,
    total_trans_fat: 0,
    total_carbohydrates: 0,
    total_sugar: 0,
    total_dietary_fiber: 0,
    total_calories: 0,
    total_natrium: 0
  });
}

// Delete a food from a meal
router.delete('/meal/:mealId/food/:foodId', authenticateToken, async (req, res) => {
  const { mealId, foodId } = req.params;

  try {
    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    const foodIndex = meal.foods.indexOf(foodId);
    if (foodIndex === -1) {
      return res.status(404).json({ error: 'Food not found in the meal' });
    }

    // Remove the food and its corresponding grams
    meal.foods.splice(foodIndex, 1);
    meal.grams.splice(foodIndex, 1);

    // Recalculate totals for remaining foods
    const remainingFoods = await Food.find({ '_id': { $in: meal.foods } });
    const totals = calculateTotals(remainingFoods);

    // Update the meal's totals
    Object.assign(meal, totals);
    
    await meal.save();
    res.status(200).json({ message: 'Food removed successfully.', meal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
