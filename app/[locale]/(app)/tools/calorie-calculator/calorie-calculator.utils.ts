// Types for the calorie calculator
export type Gender = "male" | "female";
export type UnitSystem = "metric" | "imperial";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type Goal = "lose_fast" | "lose_slow" | "maintain" | "gain_slow" | "gain_fast";

export interface CalorieCalculatorInputs {
  gender: Gender;
  unit: UnitSystem;
  age: number;
  height: number; // cm for metric, inches for imperial
  weight: number; // kg for metric, lbs for imperial
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface CalorieResults {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number; // Based on goal
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

// Activity level multipliers
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Little to no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Heavy exercise 6-7 days/week
  very_active: 1.9, // Very heavy physical job or training
};

// Goal adjustments (calories per day)
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose_fast: -1000, // Lose 2 lbs/week
  lose_slow: -500, // Lose 1 lb/week
  maintain: 0,
  gain_slow: 500, // Gain 1 lb/week
  gain_fast: 1000, // Gain 2 lbs/week
};

/**
 * Convert imperial units to metric for calculation
 */
function convertToMetric(inputs: CalorieCalculatorInputs): {
  weight: number;
  height: number;
} {
  if (inputs.unit === "metric") {
    return {
      weight: inputs.weight,
      height: inputs.height,
    };
  }

  // Convert lbs to kg and inches to cm
  return {
    weight: inputs.weight * 0.453592,
    height: inputs.height * 2.54,
  };
}

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 * Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
 * Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
 */
function calculateBMR(inputs: CalorieCalculatorInputs): number {
  const { weight, height } = convertToMetric(inputs);

  const baseBMR = 10 * weight + 6.25 * height - 5 * inputs.age;

  if (inputs.gender === "male") {
    return baseBMR + 5;
  } else {
    return baseBMR - 161;
  }
}

/**
 * Calculate macros based on target calories
 * Using a balanced approach: 30% protein, 40% carbs, 30% fat
 */
function calculateMacros(targetCalories: number): {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
} {
  const proteinCalories = targetCalories * 0.3;
  const carbsCalories = targetCalories * 0.4;
  const fatCalories = targetCalories * 0.3;

  // Protein and carbs = 4 calories per gram, fat = 9 calories per gram
  return {
    proteinGrams: Math.round(proteinCalories / 4),
    carbsGrams: Math.round(carbsCalories / 4),
    fatGrams: Math.round(fatCalories / 9),
  };
}

/**
 * Main calculation function
 */
export function calculateTDEE(inputs: CalorieCalculatorInputs): CalorieResults {
  const bmr = calculateBMR(inputs);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[inputs.activityLevel];
  const targetCalories = tdee + GOAL_ADJUSTMENTS[inputs.goal];

  // Ensure minimum calories (never go below 1200 for safety)
  const safeTargetCalories = Math.max(1200, targetCalories);

  const macros = calculateMacros(safeTargetCalories);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(safeTargetCalories),
    ...macros,
  };
}
