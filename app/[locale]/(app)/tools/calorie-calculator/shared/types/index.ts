// Calorie calculator types for better type safety
export type CalculatorFormula = "mifflin" | "harris" | "katch" | "cunningham" | "oxford";

export interface CalculatorConfig {
  formula: CalculatorFormula;
  requiresBodyFat: boolean;
  name: string;
  description: string;
  buttonGradient: {
    from: string;
    to: string;
  };
}
