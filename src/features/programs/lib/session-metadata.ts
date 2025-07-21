/* eslint-disable max-len */
import { Locale } from "locales/types";
import { getLocalizedMetadata } from "@/shared/config/localized-metadata";
import { ProgramSessionWithExercises } from "@/entities/program-session/types/program-session.types";
import { ProgramI18nReference } from "@/entities/program/types/program.types";

import { getSessionTitle, getSessionDescription, getProgramTitle } from "./translations-mapper";

export function generateSessionSEOKeywords(session: ProgramSessionWithExercises, program: ProgramI18nReference, locale: Locale): string[] {
  const baseData = getLocalizedMetadata(locale);
  const sessionTitle = getSessionTitle(session, locale);
  const programTitle = getProgramTitle(program, locale);

  const exerciseNames = session.exercises.map((ex) => {
    switch (locale) {
      case "en":
        return ex.exercise.nameEn || ex.exercise.name;
      case "es":
        return ex.exercise.nameEn || ex.exercise.name; // Using nameEn as fallback since nameEs doesn't exist
      case "pt":
        return ex.exercise.nameEn || ex.exercise.name; // Using nameEn as fallback since namePt doesn't exist
      case "ru":
        return ex.exercise.nameEn || ex.exercise.name; // Using nameEn as fallback since nameRu doesn't exist
      case "zh-CN":
        return ex.exercise.nameEn || ex.exercise.name; // Using nameEn as fallback since nameZhCn doesn't exist
      default:
        return ex.exercise.name;
    }
  });

  const localizedSessionType =
    locale === "en"
      ? "workout session"
      : locale === "es"
        ? "sesión de entrenamiento"
        : locale === "pt"
          ? "sessão de treino"
          : locale === "ru"
            ? "тренировочная сессия"
            : locale === "zh-CN"
              ? "训练课程"
              : "séance d'entraînement";

  return [
    ...baseData.keywords,
    sessionTitle.toLowerCase(),
    programTitle.toLowerCase(),
    localizedSessionType,
    ...exerciseNames.map((name) => name.toLowerCase()),
    "fitness",
    "exercise",
    "training",
    "workout",
  ];
}

export function generateSessionMetadata(session: ProgramSessionWithExercises, program: ProgramI18nReference, locale: Locale) {
  const sessionTitle = getSessionTitle(session, locale);
  const programTitle = getProgramTitle(program, locale);
  const sessionDescription = getSessionDescription(session, locale);
  const keywords = generateSessionSEOKeywords(session, program, locale);

  const title = `${sessionTitle} - ${programTitle}`;
  const description =
    sessionDescription ||
    (locale === "en"
      ? `${sessionTitle} workout session from the ${programTitle} program. ${session.exercises.length} exercises, ~${Math.round(session.exercises.length * 3)} minutes.`
      : locale === "es"
        ? `Sesión de entrenamiento ${sessionTitle} del programa ${programTitle}. ${session.exercises.length} ejercicios, ~${Math.round(session.exercises.length * 3)} minutos.`
        : locale === "pt"
          ? `Sessão de treino ${sessionTitle} do programa ${programTitle}. ${session.exercises.length} exercícios, ~${Math.round(session.exercises.length * 3)} minutos.`
          : locale === "ru"
            ? `Тренировочная сессия ${sessionTitle} из программы ${programTitle}. ${session.exercises.length} упражнений, ~${Math.round(session.exercises.length * 3)} минут.`
            : locale === "zh-CN"
              ? `${programTitle}计划中的${sessionTitle}训练课程。${session.exercises.length}个练习，约${Math.round(session.exercises.length * 3)}分钟。`
              : `Séance d'entraînement ${sessionTitle} du programme ${programTitle}. ${session.exercises.length} exercices, ~${Math.round(session.exercises.length * 3)} minutes.`);

  return {
    title,
    description,
    keywords: keywords.join(", "),
  };
}
