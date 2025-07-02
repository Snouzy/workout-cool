import { TFunction } from "locales/client";

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

export function calculateBmi(data: BmiData, t: TFunction): BmiResult {
  const { height: initialHeight, weight: initialWeight, unit } = data;
  let height = initialHeight;
  let weight = initialWeight;

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
  const recommendations = getRecommendations(category, t);

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

export function getRecommendations(category: BmiCategory, t: TFunction): string[] {
  switch (category) {
    case "severe_thinness":
      return [
        t("bmi-calculator.recommendations.severe_thinness.medical_consultation"),
        t("bmi-calculator.recommendations.severe_thinness.nutritional_assessment"),
        t("bmi-calculator.recommendations.severe_thinness.weight_gain_program"),
        t("bmi-calculator.recommendations.severe_thinness.screen_conditions"),
        t("bmi-calculator.recommendations.severe_thinness.psychological_evaluation"),
      ];
    case "moderate_thinness":
      return [
        t("bmi-calculator.recommendations.moderate_thinness.healthcare_provider"),
        t("bmi-calculator.recommendations.moderate_thinness.nutrient_dense_foods"),
        t("bmi-calculator.recommendations.moderate_thinness.registered_dietitian"),
        t("bmi-calculator.recommendations.moderate_thinness.monitor_malnutrition"),
        t("bmi-calculator.recommendations.moderate_thinness.gradual_weight_gain"),
      ];
    case "mild_thinness":
      return [
        t("bmi-calculator.recommendations.mild_thinness.consider_healthcare"),
        t("bmi-calculator.recommendations.mild_thinness.nutrient_dense_foods"),
        t("bmi-calculator.recommendations.mild_thinness.strength_training"),
        t("bmi-calculator.recommendations.mild_thinness.monitor_health"),
        t("bmi-calculator.recommendations.mild_thinness.gradual_weight_gain"),
      ];
    case "normal":
      return [
        t("bmi-calculator.recommendations.normal.maintain_weight"),
        t("bmi-calculator.recommendations.normal.physical_activity"),
        t("bmi-calculator.recommendations.normal.balanced_diet"),
        t("bmi-calculator.recommendations.normal.health_checkups"),
        t("bmi-calculator.recommendations.normal.overall_wellness"),
      ];
    case "overweight":
      return [
        t("bmi-calculator.recommendations.overweight.gradual_weight_loss"),
        t("bmi-calculator.recommendations.overweight.increase_activity"),
        t("bmi-calculator.recommendations.overweight.portion_control"),
        t("bmi-calculator.recommendations.overweight.healthcare_provider"),
        t("bmi-calculator.recommendations.overweight.lifestyle_goals"),
      ];
    case "obese_class_1":
      return [
        t("bmi-calculator.recommendations.obese_class_1.healthcare_provider"),
        t("bmi-calculator.recommendations.obese_class_1.weight_loss_target"),
        t("bmi-calculator.recommendations.obese_class_1.diet_exercise"),
        t("bmi-calculator.recommendations.obese_class_1.nutritional_counseling"),
        t("bmi-calculator.recommendations.obese_class_1.screen_conditions"),
      ];
    case "obese_class_2":
      return [
        t("bmi-calculator.recommendations.obese_class_2.medical_supervision"),
        t("bmi-calculator.recommendations.obese_class_2.lifestyle_programs"),
        t("bmi-calculator.recommendations.obese_class_2.evaluate_conditions"),
        t("bmi-calculator.recommendations.obese_class_2.medical_treatments"),
        t("bmi-calculator.recommendations.obese_class_2.bariatric_surgery"),
      ];
    case "obese_class_3":
      return [
        t("bmi-calculator.recommendations.obese_class_3.medical_consultation"),
        t("bmi-calculator.recommendations.obese_class_3.bariatric_surgery"),
        t("bmi-calculator.recommendations.obese_class_3.weight_management"),
        t("bmi-calculator.recommendations.obese_class_3.health_complications"),
        t("bmi-calculator.recommendations.obese_class_3.multidisciplinary"),
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

export function getHealthRisks(_category: BmiCategory, t: TFunction): { overweight: string[]; underweight: string[] } {
  const overweightRisks = [
    t("bmi-calculator.health_risks.overweight.high_blood_pressure"),
    t("bmi-calculator.health_risks.overweight.ldl_cholesterol"),
    t("bmi-calculator.health_risks.overweight.hdl_cholesterol"),
    t("bmi-calculator.health_risks.overweight.triglycerides"),
    t("bmi-calculator.health_risks.overweight.type_2_diabetes"),
    t("bmi-calculator.health_risks.overweight.coronary_heart_disease"),
    t("bmi-calculator.health_risks.overweight.stroke"),
    t("bmi-calculator.health_risks.overweight.gallbladder_disease"),
    t("bmi-calculator.health_risks.overweight.osteoarthritis"),
    t("bmi-calculator.health_risks.overweight.sleep_apnea"),
    t("bmi-calculator.health_risks.overweight.certain_cancers"),
    t("bmi-calculator.health_risks.overweight.low_quality_life"),
    t("bmi-calculator.health_risks.overweight.mental_illnesses"),
    t("bmi-calculator.health_risks.overweight.body_pains"),
    t("bmi-calculator.health_risks.overweight.increased_mortality"),
  ];

  const underweightRisks = [
    t("bmi-calculator.health_risks.underweight.malnutrition"),
    t("bmi-calculator.health_risks.underweight.anemia"),
    t("bmi-calculator.health_risks.underweight.osteoporosis"),
    t("bmi-calculator.health_risks.underweight.immune_function"),
    t("bmi-calculator.health_risks.underweight.growth_development"),
    t("bmi-calculator.health_risks.underweight.reproductive_issues"),
    t("bmi-calculator.health_risks.underweight.miscarriage_risk"),
    t("bmi-calculator.health_risks.underweight.surgery_complications"),
    t("bmi-calculator.health_risks.underweight.increased_mortality"),
    t("bmi-calculator.health_risks.underweight.underlying_conditions"),
  ];

  return { overweight: overweightRisks, underweight: underweightRisks };
}