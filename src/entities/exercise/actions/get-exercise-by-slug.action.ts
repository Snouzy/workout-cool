"use server";

import { prisma } from "@/shared/lib/prisma";

export interface ExerciseDetail {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  description: string;
  instructions: string[];
  cues: string[];
  commonMistakes: string[];
  videoUrl: string | null;
  imageUrls: string[];
  difficultyLevel: string;
  measurementType: string;
  defaultSets: number;
  defaultReps: number | null;
  defaultHoldTime: number | null;
  restBetweenSets: number;
  category: string;
  subcategory: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  bandAssistance: boolean;
  bandResistance: boolean;
  equipment: Array<{
    id: string;
    name: string;
    type: string;
    heightVariant: string | null;
  }>;
  progressionContext: {
    familyId: string;
    familyName: string;
    familySlug: string;
    level: number;
    unlockCriteria: Record<string, unknown>;
    prevExercise: { id: string; name: string; nameEn: string | null; slug: string; level: number } | null;
    nextExercise: { id: string; name: string; nameEn: string | null; slug: string; level: number } | null;
  } | null;
}

export async function getExerciseBySlug(slug: string): Promise<ExerciseDetail | null> {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { slug },
      include: {
        equipmentRequired: {
          include: { equipment: true },
        },
        progressionLevels: {
          include: {
            family: true,
          },
        },
      },
    });

    if (!exercise) {
      return null;
    }

    let progressionContext: ExerciseDetail["progressionContext"] = null;

    const progressionLevel = exercise.progressionLevels[0];
    if (progressionLevel) {
      const family = progressionLevel.family;

      const [prevLevel, nextLevel] = await Promise.all([
        prisma.progressionLevel.findFirst({
          where: { familyId: family.id, level: progressionLevel.level - 1 },
          include: { exercise: { select: { id: true, name: true, nameEn: true, slug: true } } },
        }),
        prisma.progressionLevel.findFirst({
          where: { familyId: family.id, level: progressionLevel.level + 1 },
          include: { exercise: { select: { id: true, name: true, nameEn: true, slug: true } } },
        }),
      ]);

      progressionContext = {
        familyId: family.id,
        familyName: family.name,
        familySlug: family.slug,
        level: progressionLevel.level,
        unlockCriteria: progressionLevel.unlockCriteria as Record<string, unknown>,
        prevExercise: prevLevel
          ? { id: prevLevel.exercise.id, name: prevLevel.exercise.name, nameEn: prevLevel.exercise.nameEn, slug: prevLevel.exercise.slug, level: prevLevel.level }
          : null,
        nextExercise: nextLevel
          ? { id: nextLevel.exercise.id, name: nextLevel.exercise.name, nameEn: nextLevel.exercise.nameEn, slug: nextLevel.exercise.slug, level: nextLevel.level }
          : null,
      };
    }

    return {
      id: exercise.id,
      name: exercise.name,
      nameEn: exercise.nameEn,
      slug: exercise.slug,
      description: exercise.description,
      instructions: exercise.instructions,
      cues: exercise.cues,
      commonMistakes: exercise.commonMistakes,
      videoUrl: exercise.videoUrl,
      imageUrls: exercise.imageUrls,
      difficultyLevel: exercise.difficultyLevel,
      measurementType: exercise.measurementType,
      defaultSets: exercise.defaultSets,
      defaultReps: exercise.defaultReps,
      defaultHoldTime: exercise.defaultHoldTime,
      restBetweenSets: exercise.restBetweenSets,
      category: exercise.category,
      subcategory: exercise.subcategory,
      primaryMuscles: exercise.primaryMuscles,
      secondaryMuscles: exercise.secondaryMuscles,
      bandAssistance: exercise.bandAssistance,
      bandResistance: exercise.bandResistance,
      equipment: exercise.equipmentRequired.map((eq) => ({
        id: eq.equipment.id,
        name: eq.equipment.name,
        type: eq.equipment.type,
        heightVariant: eq.equipment.heightVariant,
      })),
      progressionContext,
    };
  } catch (error) {
    console.error("Error fetching exercise by slug:", error);
    return null;
  }
}
