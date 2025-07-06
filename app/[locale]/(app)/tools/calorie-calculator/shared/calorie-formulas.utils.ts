// Shared types and formulas for all calorie calculators

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
  bodyFatPercentage?: number; // Optional for Katch-McArdle
}

export interface CalorieResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

// Activity level multipliers
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Goal adjustments
export const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose_fast: -1000,
  lose_slow: -500,
  maintain: 0,
  gain_slow: 500,
  gain_fast: 1000,
};

// Convert imperial to metric
export function convertToMetric(inputs: CalorieCalculatorInputs): {
  weight: number;
  height: number;
} {
  if (inputs.unit === "metric") {
    return { weight: inputs.weight, height: inputs.height };
  }
  return {
    weight: inputs.weight * 0.453592,
    height: inputs.height * 2.54,
  };
}

// Calculate macros
export function calculateMacros(targetCalories: number): {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
} {
  const proteinCalories = targetCalories * 0.3;
  const carbsCalories = targetCalories * 0.4;
  const fatCalories = targetCalories * 0.3;

  return {
    proteinGrams: Math.round(proteinCalories / 4),
    carbsGrams: Math.round(carbsCalories / 4),
    fatGrams: Math.round(fatCalories / 9),
  };
}

// Mifflin-St Jeor Formula (1990)
export function calculateMifflinStJeor(inputs: CalorieCalculatorInputs): number {
  const { weight, height } = convertToMetric(inputs);
  const baseBMR = 10 * weight + 6.25 * height - 5 * inputs.age;

  return inputs.gender === "male" ? baseBMR + 5 : baseBMR - 161;
}

// Harris-Benedict Revised Formula (1984)
export function calculateHarrisBenedict(inputs: CalorieCalculatorInputs): number {
  const { weight, height } = convertToMetric(inputs);

  if (inputs.gender === "male") {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * inputs.age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * inputs.age;
  }
}

// Katch-McArdle Formula (requires body fat percentage)
export function calculateKatchMcArdle(inputs: CalorieCalculatorInputs): number {
  if (!inputs.bodyFatPercentage) {
    throw new Error("Body fat percentage is required for Katch-McArdle formula");
  }

  const { weight } = convertToMetric(inputs);
  const leanBodyMass = weight * (1 - inputs.bodyFatPercentage / 100);

  return 370 + 21.6 * leanBodyMass;
}

// Cunningham Formula (for athletes with very low body fat)
export function calculateCunningham(inputs: CalorieCalculatorInputs): number {
  if (!inputs.bodyFatPercentage) {
    throw new Error("Body fat percentage is required for Cunningham formula");
  }

  const { weight } = convertToMetric(inputs);
  const leanBodyMass = weight * (1 - inputs.bodyFatPercentage / 100);

  return 500 + 22 * leanBodyMass;
}

// Oxford Formula (2005)
export function calculateOxford(inputs: CalorieCalculatorInputs): number {
  const { weight } = convertToMetric(inputs);

  if (inputs.gender === "male") {
    return inputs.age < 30 ? 16.6 * weight + (77 * inputs.height) / 100 + 572 : 14.4 * weight + (313 * inputs.height) / 100 + 113;
  } else {
    return inputs.age < 30 ? 13.1 * weight + (558 * inputs.height) / 100 + 184 : 13.4 * weight + (346 * inputs.height) / 100 + 247;
  }
}

// Main calculation function
export function calculateCalories(
  inputs: CalorieCalculatorInputs,
  formula: "mifflin" | "harris" | "katch" | "cunningham" | "oxford" = "mifflin",
): CalorieResults {
  let bmr: number;

  switch (formula) {
    case "harris":
      bmr = calculateHarrisBenedict(inputs);
      break;
    case "katch":
      bmr = calculateKatchMcArdle(inputs);
      break;
    case "cunningham":
      bmr = calculateCunningham(inputs);
      break;
    case "oxford":
      bmr = calculateOxford(inputs);
      break;
    default:
      bmr = calculateMifflinStJeor(inputs);
  }

  const tdee = bmr * ACTIVITY_MULTIPLIERS[inputs.activityLevel];
  const targetCalories = Math.max(1200, tdee + GOAL_ADJUSTMENTS[inputs.goal]);
  const macros = calculateMacros(targetCalories);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    ...macros,
  };
}
