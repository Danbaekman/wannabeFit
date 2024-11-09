const calculateBMR = (gender, weight, height, age) => {
  let bmr;
  if (gender === 'M') {
    bmr = 66.47 + (13.75 * weight) + (5 * height) - (6.76 * age);
  } else if (gender === 'F') {
    bmr = 655.1 + (9.56 * weight) + (1.85 * height) - (4.68 * age);
  } else {
    throw new Error('Invalid gender');
  }
  return parseFloat(bmr.toFixed(2));
};

// 활동대사량(TDEE) 계산
const calculateTDEE = (bmr, activityLevel) => {
  let activityMultiplier;
  switch (activityLevel) {
    case 0: activityMultiplier = 1.2; break;
    case 1: activityMultiplier = 1.375; break;
    case 2: activityMultiplier = 1.55; break;
    case 3: activityMultiplier = 1.725; break;
    case 4: activityMultiplier = 1.9; break;
    default: throw new Error('Invalid activity level');
  }
  return parseFloat((bmr * activityMultiplier).toFixed(2));
};

// BMR, TDEE 및 매크로 계산 함수
const calculateBMRAndTDEE = (gender, weight, height, age, activityLevel, goal, targetWeight, customCalories = null, customMacros = {}) => {
  const bmr = calculateBMR(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  
  let totalCalories;

  // 목표에 따른 총 칼로리 설정
  if (customCalories !== null) {
    totalCalories = customCalories; // 사용자 지정 칼로리
  } else {
    if (goal === 'bulk') {
      totalCalories = tdee + 500; // 벌크업: TDEE + 500
    } else if (goal === 'diet') {
      totalCalories = tdee - 500; // 다이어트: TDEE - 500
    } else if (goal === 'maintain') {
      totalCalories = tdee; // 유지: TDEE
    } else {
      throw new Error('Invalid goal');
    }
  }

  // 매크로 비율 설정
  const macros = calculateMacros(totalCalories, goal, customMacros);

  // 목표 체중에 도달하기 위한 예상 기간 계산
  const weeksToGoal = predictWeightChangeDuration(weight, targetWeight, totalCalories, activityLevel, gender, height, age);

  return { bmr, tdee, totalCalories, macros, weeksToGoal };
};

// 매크로 계산 함수
const calculateMacros = (totalCalories, goal, customMacros) => {
  let protein, carbs, fat;

  if (Object.keys(customMacros).length > 0) {
    protein = (totalCalories * (customMacros.protein || 0.25)) / 4; // 기본 25% 또는 사용자 지정
    fat = (totalCalories * (customMacros.fat || 0.20)) / 9; // 기본 20% 또는 사용자 지정
    carbs = (totalCalories - (protein * 4 + fat * 9)) / 4; // 나머지 탄수화물
  } else {
    if (goal === 'bulk') {
      protein = (totalCalories * 0.25) / 4;
      fat = (totalCalories * 0.20) / 9;
      carbs = (totalCalories - (protein * 4 + fat * 9)) / 4;
    } else if (goal === 'diet') {
      protein = (totalCalories * 0.30) / 4;
      fat = (totalCalories * 0.25) / 9;
      carbs = (totalCalories - (protein * 4 + fat * 9)) / 4;
    } else { // maintain
      protein = (totalCalories * 0.25) / 4;
      fat = (totalCalories * 0.20) / 9;
      carbs = (totalCalories - (protein * 4 + fat * 9)) / 4;
    }
  }

  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    totalCalories: Math.round(totalCalories)
  };
};

// 체중 변화 예측 함수
const predictWeightChangeDuration = (currentWeight, targetWeight, totalCalories, activityLevel, gender, height, age) => {
  const calorieDeficitPerKg = 7700; // 1kg 체중 변화에 필요한 칼로리
  const weightChange = targetWeight - currentWeight;

  // 목표 체중 도달을 위한 총 칼로리 필요량
  const totalCaloriesNeeded = weightChange * calorieDeficitPerKg;

  // 하루에 소모하는 칼로리 계산
  const bmr = calculateBMR(gender, currentWeight, height, age);
  const dailyTDEE = calculateTDEE(bmr, activityLevel);
  const dailyCaloricSurplus = totalCalories - dailyTDEE;

  // 필요 기간 계산
  const daysNeeded = totalCaloriesNeeded / dailyCaloricSurplus;

  // 0 또는 부정적인 경우 0을 반환
  return daysNeeded > 0 ? Math.ceil(daysNeeded / 7) : 0; // 주 단위로 변환
};

module.exports = calculateBMRAndTDEE;
