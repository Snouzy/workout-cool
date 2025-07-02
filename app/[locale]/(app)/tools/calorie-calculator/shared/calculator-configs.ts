import type { CalculatorConfig } from "./types";

// Calculator configurations
export const calculatorConfigs: Record<string, CalculatorConfig> = {
  oxford: {
    formula: "oxford",
    requiresBodyFat: false,
    name: "Oxford Calculator",
    description: "Uses the Oxford formula for calorie calculation",
    buttonGradient: {
      from: "#4F8EF7",
      to: "#238BE6",
    },
  },
  "mifflin-st-jeor": {
    formula: "mifflin",
    requiresBodyFat: false,
    name: "Mifflin-St Jeor Calculator",
    description: "Uses the Mifflin-St Jeor formula (most accurate for general population)",
    buttonGradient: {
      from: "#06B6D4",
      to: "#0891B2",
    },
  },
  "harris-benedict": {
    formula: "harris",
    requiresBodyFat: false,
    name: "Harris-Benedict Calculator",
    description: "Uses the revised Harris-Benedict formula",
    buttonGradient: {
      from: "#10B981",
      to: "#059669",
    },
  },
  "katch-mcardle": {
    formula: "katch",
    requiresBodyFat: true,
    name: "Katch-McArdle Calculator",
    description: "Most accurate for lean individuals (requires body fat %)",
    buttonGradient: {
      from: "#F59E0B",
      to: "#D97706",
    },
  },
  cunningham: {
    formula: "cunningham",
    requiresBodyFat: true,
    name: "Cunningham Calculator",
    description: "Best for athletes with very low body fat (requires body fat %)",
    buttonGradient: {
      from: "#8B5CF6",
      to: "#7C3AED",
    },
  },
};
