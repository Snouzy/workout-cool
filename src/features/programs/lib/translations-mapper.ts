import { Locale } from "locales/types";
import { getI18nField } from "@/shared/lib/i18n-mapper";
import { PublicProgram } from "@/features/programs/actions/get-public-programs.action";
import { ProgramDetail } from "@/features/programs/actions/get-program-by-slug.action";
import { ProgramSessionWithExercises } from "@/entities/program-session/types/program-session.types";
import { ProgramI18nReference } from "@/entities/program/types/program.types";

// Re-export the generic mapper for convenience
export { getI18nField };

export const getWeekTitle = (week: ProgramDetail["weeks"][number], locale: Locale): string => {
  return getI18nField(week, "title", locale);
};

export const getWeekDescription = (week: ProgramDetail["weeks"][number], locale: Locale): string => {
  return getI18nField(week, "description", locale);
};

// Specific mappers for program entities
export function getProgramTitle(program: ProgramDetail | PublicProgram | ProgramI18nReference, locale: Locale): string {
  return getI18nField(program, "title", locale);
}

export function getProgramDescription(program: ProgramDetail | PublicProgram, locale: Locale): string {
  return getI18nField(program, "description", locale);
}

export function getProgramSlug(program: ProgramDetail | PublicProgram, locale: Locale): string {
  return getI18nField(program, "slug", locale);
}

export function getSessionTitle(
  session: ProgramDetail["weeks"][number]["sessions"][number] | ProgramSessionWithExercises,
  locale: Locale,
): string {
  return getI18nField(session, "title", locale);
}

export function getSessionDescription(session: any, locale: Locale): string {
  return getI18nField(session, "description", locale);
}

export function getSessionSlug(session: any, locale: Locale): string {
  return getI18nField(session, "slug", locale);
}

export function getExerciseName(exercise: any, locale: Locale): string {
  return getI18nField(exercise, "name", locale);
}

export function getExerciseDescription(exercise: any, locale: Locale): string {
  return getI18nField(exercise, "description", locale);
}

export function getExerciseInstructions(exercise: any, locale: Locale): string {
  return getI18nField(exercise, "instructions", locale);
}
