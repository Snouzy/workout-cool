import { Locale } from "locales/types";
import { TFunction } from "locales/client";
import { ATTRIBUTE_VALUE_TRANSLATION_KEYS } from "@/shared/lib/attribute-value-translation";
import { getLocalizedMetadata } from "@/shared/config/localized-metadata";

import { ProgramDetail } from "../actions/get-program-by-slug.action";
import { getProgramTitle } from "./translations-mapper";

export function generateProgramSEOKeywords(program: ProgramDetail, locale: Locale, t: TFunction): string[] {
  const baseData = getLocalizedMetadata(locale);
  const localizedTitle = getProgramTitle(program, locale);
  const levelTranslation = t(`levels.${program.level}` as keyof typeof t);
  const equipmentTranslations = program.equipment.map((eq) => ATTRIBUTE_VALUE_TRANSLATION_KEYS[eq]);

  return [
    ...baseData.keywords,
    localizedTitle.toLowerCase(),
    levelTranslation.toLowerCase(),
    program.category.toLowerCase(),
    ...equipmentTranslations.map((eq) => eq.toLowerCase()),
    locale === "en"
      ? "workout program"
      : locale === "es"
        ? "programa de entrenamiento"
        : locale === "pt"
          ? "programa de treino"
          : locale === "ru"
            ? "программа тренировок"
            : locale === "zh-CN"
              ? "训练计划"
              : "programme d'entraînement",
  ];
}
