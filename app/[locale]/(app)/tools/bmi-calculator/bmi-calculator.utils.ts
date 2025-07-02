export type UnitSystem = "metric" | "imperial";

export interface BmiData {
  height: number; // cm for metric, inches for imperial
  weight: number; // kg for metric, lbs for imperial
  unit: UnitSystem;
}

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  healthRisk: HealthRisk;
  recommendations: string[];
}

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese_class_1" | "obese_class_2" | "obese_class_3";

export type HealthRisk = "low" | "normal" | "increased" | "high" | "very_high" | "extremely_high";

export function calculateBmi(data: BmiData): BmiResult {
  let { height, weight } = data;
  const { unit } = data;

  // Convert to metric if needed
  if (unit === "imperial") {
    height = height * 2.54; // inches to cm
    weight = weight * 0.453592; // lbs to kg
  }

  // Convert height from cm to meters
  const heightInMeters = height / 100;

  // Calculate BMI
  const bmi = weight / (heightInMeters * heightInMeters);

  // Determine category and health risk
  const category = getBmiCategory(bmi);
  const healthRisk = getHealthRisk(category);
  const recommendations = getRecommendations(category);

  return {
    bmi: Math.round(bmi * 10) / 10, // Round to 1 decimal place
    category,
    healthRisk,
    recommendations,
  };
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  if (bmi < 35) return "obese_class_1";
  if (bmi < 40) return "obese_class_2";
  return "obese_class_3";
}

export function getHealthRisk(category: BmiCategory): HealthRisk {
  switch (category) {
    case "underweight":
      return "increased";
    case "normal":
      return "normal";
    case "overweight":
      return "increased";
    case "obese_class_1":
      return "high";
    case "obese_class_2":
      return "very_high";
    case "obese_class_3":
      return "extremely_high";
    default:
      return "normal";
  }
}

export function getRecommendations(category: BmiCategory): string[] {
  switch (category) {
    case "underweight":
      return [
        "Consider consulting with a healthcare provider",
        "Focus on nutrient-dense foods to gain healthy weight",
        "Include strength training to build muscle mass",
        "Monitor your health regularly",
      ];
    case "normal":
      return [
        "Maintain your current healthy weight",
        "Continue regular physical activity",
        "Eat a balanced, nutritious diet",
        "Regular health check-ups",
      ];
    case "overweight":
      return [
        "Aim for gradual weight loss (1-2 lbs per week)",
        "Increase physical activity to 150+ minutes per week",
        "Focus on portion control and balanced nutrition",
        "Consider consulting with a healthcare provider",
      ];
    case "obese_class_1":
      return [
        "Consult with a healthcare provider for a weight management plan",
        "Aim for 5-10% weight loss initially",
        "Combine diet and exercise interventions",
        "Consider professional nutritional counseling",
      ];
    case "obese_class_2":
      return [
        "Seek medical supervision for weight management",
        "Consider comprehensive lifestyle intervention programs",
        "Evaluate for weight-related health conditions",
        "May benefit from medical weight loss treatments",
      ];
    case "obese_class_3":
      return [
        "Immediate medical consultation recommended",
        "Consider bariatric surgery evaluation",
        "Comprehensive medical weight management program",
        "Address weight-related health complications",
      ];
    default:
      return [];
  }
}

export function getBmiRange(category: BmiCategory): { min: number; max: number } {
  switch (category) {
    case "underweight":
      return { min: 0, max: 18.4 };
    case "normal":
      return { min: 18.5, max: 24.9 };
    case "overweight":
      return { min: 25, max: 29.9 };
    case "obese_class_1":
      return { min: 30, max: 34.9 };
    case "obese_class_2":
      return { min: 35, max: 39.9 };
    case "obese_class_3":
      return { min: 40, max: 100 };
    default:
      return { min: 0, max: 100 };
  }
}

export function convertHeight(height: number, fromUnit: UnitSystem, toUnit: UnitSystem): number {
  if (fromUnit === toUnit) return height;

  if (fromUnit === "imperial" && toUnit === "metric") {
    return height * 2.54; // inches to cm
  } else {
    return height / 2.54; // cm to inches
  }
}

export function convertWeight(weight: number, fromUnit: UnitSystem, toUnit: UnitSystem): number {
  if (fromUnit === toUnit) return weight;

  if (fromUnit === "imperial" && toUnit === "metric") {
    return weight * 0.453592; // lbs to kg
  } else {
    return weight / 0.453592; // kg to lbs
  }
}
