import { describe, expect, it } from "vitest";

import { getI18nField } from "./i18n-mapper";

import { getExerciseText } from "@/entities/exercise/shared/localized-text";

describe("Swedish database translations", () => {
  it("reads each program field independently and keeps existing English URLs", () => {
    const program = {
      title: "Force",
      titleEn: "Strength",
      titleSv: "Styrka",
      description: "Débutant",
      descriptionEn: "Beginner",
      descriptionSv: null,
      slug: "force",
      slugEn: "strength",
    };

    expect(getI18nField(program, "title", "sv")).toBe("Styrka");
    expect(getI18nField(program, "description", "sv")).toBe("Beginner");
    expect(getI18nField(program, "slug", "sv")).toBe("strength");
  });

  it("uses Swedish instructions and falls back to French when English is empty", () => {
    const sessionExercise = { instructions: "Respirez.", instructionsEn: "", instructionsSv: "Andas." };

    expect(getI18nField(sessionExercise, "instructions", "sv")).toBe("Andas.");
    expect(getI18nField({ ...sessionExercise, instructionsSv: null }, "instructions", "sv")).toBe("Respirez.");
  });

  it("can display both translated exercises and workouts saved before Swedish fields existed", () => {
    const saved = { name: "Fente", nameEn: "Lunge" };
    const translated = { ...saved, nameSv: "Utfall", introductionEn: "Stand up.", introductionSv: "Stå upp." };

    expect(getExerciseText(translated, "name", "sv")).toBe("Utfall");
    expect(getExerciseText(translated, "introduction", "sv")).toBe("Stå upp.");
    expect(getExerciseText(saved, "name", "sv")).toBe("Lunge");
    expect(getExerciseText({ name: "Fente", nameEn: null }, "name", "sv")).toBe("Fente");
    expect(getExerciseText(translated, "name", "es")).toBe("Lunge");
    expect(getExerciseText(translated, "name", "fr")).toBe("Fente");
  });
});
