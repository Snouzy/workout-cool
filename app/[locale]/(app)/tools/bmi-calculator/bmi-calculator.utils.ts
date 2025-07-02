export type UnitSystem = "metric" | "imperial";

export interface BmiData {
  height: number; // cm for metric, inches for imperial
  weight: number; // kg for metric, lbs for imperial
  unit: UnitSystem;
}

export interface BmiResult {
  bmi: number;
  bmiPrime: number;
  ponderalIndex: number;
  category: BmiCategory;
  healthRisk: HealthRisk;
  recommendations: string[];
  detailedInfo: {
    bmiRange: { min: number; max: number };
    idealWeight: { min: number; max: number };
    weightToLose?: number;
    weightToGain?: number;
  };
}

export type BmiCategory = 
  | "severe_thinness" 
  | "moderate_thinness" 
  | "mild_thinness" 
  | "normal" 
  | "overweight" 
  | "obese_class_1" 
  | "obese_class_2" 
  | "obese_class_3";

export type HealthRisk = "low" | "normal" | "increased" | "high" | "very_high" | "extremely_high";

export function calculateBmi(data: BmiData): BmiResult {
  let { height, weight, unit } = data;

  // Convert to metric if needed
  if (unit === "imperial") {
    height = height * 2.54; // inches to cm
    weight = weight * 0.453592; // lbs to kg
  }

  // Convert height from cm to meters
  const heightInMeters = height / 100;

  // Calculate BMI
  const bmi = weight / (heightInMeters * heightInMeters);

  // Calculate BMI Prime
  const bmiPrime = bmi / 25;

  // Calculate Ponderal Index
  const ponderalIndex = weight / (heightInMeters * heightInMeters * heightInMeters);

  // Determine category and health risk
  const category = getBmiCategory(bmi);
  const healthRisk = getHealthRisk(category);
  const recommendations = getRecommendations(category);

  // Calculate detailed info
  const bmiRange = getBmiRange(category);
  const idealWeight = calculateIdealWeight(heightInMeters);
  const weightToLose = (category === "overweight" || category === "obese_class_1" || category === "obese_class_2" || category === "obese_class_3")
    ? Math.max(0, weight - idealWeight.max)
    : undefined;
  const weightToGain = (category === "severe_thinness" || category === "moderate_thinness" || category === "mild_thinness")
    ? Math.max(0, idealWeight.min - weight)
    : undefined;

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiPrime: Math.round(bmiPrime * 100) / 100,
    ponderalIndex: Math.round(ponderalIndex * 10) / 10,
    category,
    healthRisk,
    recommendations,
    detailedInfo: {
      bmiRange,
      idealWeight,
      weightToLose,
      weightToGain,
    },
  };
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 16) return "severe_thinness";
  if (bmi < 17) return "moderate_thinness";
  if (bmi < 18.5) return "mild_thinness";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  if (bmi < 35) return "obese_class_1";
  if (bmi < 40) return "obese_class_2";
  return "obese_class_3";
}

export function getHealthRisk(category: BmiCategory): HealthRisk {
  switch (category) {
    case "severe_thinness":
      return "very_high";
    case "moderate_thinness":
      return "high";
    case "mild_thinness":
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
    case "severe_thinness":
      return [
        "Immediate medical consultation strongly recommended",
        "Comprehensive nutritional assessment needed",
        "May require supervised weight gain program",
        "Screen for underlying medical conditions",
        "Consider psychological evaluation if eating disorder suspected",
      ];
    case "moderate_thinness":
      return [
        "Consult with healthcare provider for evaluation",
        "Focus on nutrient-dense, calorie-rich foods",
        "Consider working with a registered dietitian",
        "Monitor for signs of malnutrition",
        "Gradual, healthy weight gain recommended",
      ];
    case "mild_thinness":
      return [
        "Consider consulting with a healthcare provider",
        "Focus on nutrient-dense foods to gain healthy weight",
        "Include strength training to build muscle mass",
        "Monitor your health regularly",
        "Aim for gradual weight gain (1-2 lbs per week)",
      ];
    case "normal":
      return [
        "Maintain your current healthy weight",
        "Continue regular physical activity (150+ minutes per week)",
        "Eat a balanced, nutritious diet",
        "Regular health check-ups",
        "Focus on overall wellness and body composition",
      ];
    case "overweight":
      return [
        "Aim for gradual weight loss (1-2 lbs per week)",
        "Increase physical activity to 150+ minutes per week",
        "Focus on portion control and balanced nutrition",
        "Consider consulting with a healthcare provider",
        "Set realistic, sustainable lifestyle goals",
      ];
    case "obese_class_1":
      return [
        "Consult with a healthcare provider for a weight management plan",
        "Aim for 5-10% weight loss initially",
        "Combine diet and exercise interventions",
        "Consider professional nutritional counseling",
        "Screen for weight-related health conditions",
      ];
    case "obese_class_2":
      return [
        "Seek medical supervision for weight management",
        "Consider comprehensive lifestyle intervention programs",
        "Evaluate for weight-related health conditions",
        "May benefit from medical weight loss treatments",
        "Consider bariatric surgery evaluation if appropriate",
      ];
    case "obese_class_3":
      return [
        "Immediate medical consultation recommended",
        "Consider bariatric surgery evaluation",
        "Comprehensive medical weight management program",
        "Address weight-related health complications",
        "Multidisciplinary approach with medical team",
      ];
    default:
      return [];
  }
}

export function getBmiRange(category: BmiCategory): { min: number; max: number } {
  switch (category) {
    case "severe_thinness":
      return { min: 0, max: 15.9 };
    case "moderate_thinness":
      return { min: 16, max: 16.9 };
    case "mild_thinness":
      return { min: 17, max: 18.4 };
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

export function calculateIdealWeight(heightInMeters: number): { min: number; max: number } {
  // Calculate ideal weight range based on normal BMI (18.5-24.9)
  const minWeight = 18.5 * heightInMeters * heightInMeters;
  const maxWeight = 24.9 * heightInMeters * heightInMeters;
  
  return {
    min: Math.round(minWeight * 10) / 10,
    max: Math.round(maxWeight * 10) / 10,
  };
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

// Additional utility functions for enhanced BMI analysis

export function getBmiPrimeCategory(bmiPrime: number): string {
  if (bmiPrime < 0.64) return "severe_thinness";
  if (bmiPrime < 0.68) return "moderate_thinness";
  if (bmiPrime < 0.74) return "mild_thinness";
  if (bmiPrime <= 1) return "normal";
  if (bmiPrime <= 1.2) return "overweight";
  if (bmiPrime <= 1.4) return "obese_class_1";
  if (bmiPrime <= 1.6) return "obese_class_2";
  return "obese_class_3";
}

export function getPonderalIndexCategory(pi: number): string {
  // Ponderal Index normal range is typically 11-14 kg/m³
  if (pi < 11) return "low";
  if (pi <= 14) return "normal";
  return "high";
}

export function getHealthRisks(category: BmiCategory): { overweight: string[]; underweight: string[] } {
  const overweightRisks = [
    "High blood pressure",
    "Higher levels of LDL cholesterol (bad cholesterol)",
    "Lower levels of HDL cholesterol (good cholesterol)",
    "High levels of triglycerides",
    "Type II diabetes",
    "Coronary heart disease",
    "Stroke",
    "Gallbladder disease",
    "Osteoarthritis",
    "Sleep apnea and breathing problems",
    "Certain cancers (endometrial, breast, colon, kidney, gallbladder, liver)",
    "Low quality of life",
    "Mental illnesses such as clinical depression and anxiety",
    "Body pains and difficulty with physical functions",
    "Generally increased risk of mortality",
  ];

  const underweightRisks = [
    "Malnutrition and vitamin deficiencies",
    "Anemia (lowered ability to carry oxygen in blood)",
    "Osteoporosis (increased risk of bone fractures)",
    "Decreased immune function",
    "Growth and development issues (especially in children)",
    "Reproductive issues for women due to hormonal imbalances",
    "Higher chance of miscarriage in first trimester",
    "Potential complications during surgery",
    "Generally increased risk of mortality",
    "May indicate underlying medical conditions",
  ];

  return { overweight: overweightRisks, underweight: underweightRisks };
}