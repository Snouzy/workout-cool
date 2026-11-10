import type { Locale } from "locales/types";

import { getI18nField } from "@/shared/lib/i18n-mapper";

export function getExerciseText<Field extends "name" | "introduction" | "description">(
  exercise: Partial<Record<Field | `${Field}En` | `${Field}Sv`, string | null>>,
  field: Field,
  locale: Locale,
): string {
  // The exercise catalog is available in French, English and Swedish.
  const language = locale === "fr" || locale === "sv" ? locale : "en";
  return getI18nField(exercise, field, language, exercise[field] || "");
}
