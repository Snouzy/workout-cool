import { FormQuality, BandLevel } from "../types/workout-set";

// Static labels for form quality and band level
// These can be updated to use translations when the translation keys are added
export const FORM_QUALITY_LABELS: Record<FormQuality, string> = {
  poor: "Poor",
  acceptable: "Acceptable",
  good: "Good",
  excellent: "Excellent",
};

export const BAND_LEVEL_LABELS: Record<BandLevel, string> = {
  none: "No band",
  light: "Light",
  medium: "Medium",
  heavy: "Heavy",
  extra_heavy: "Extra Heavy",
};
