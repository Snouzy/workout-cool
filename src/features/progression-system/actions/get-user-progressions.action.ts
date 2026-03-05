"use server";

import { prisma } from "@/shared/lib/prisma";

export interface UserProgressionStatus {
  familyId: string;
  familyName: string;
  familySlug: string;
  familyCategory: string;
  currentLevel: number;
  totalLevels: number;
  currentExercise: {
    id: string;
    nameEn: string | null;
    name: string;
    slug: string;
  } | null;
  nextExercise: {
    id: string;
    nameEn: string | null;
    name: string;
    slug: string;
  } | null;
  nextUnlockCriteria: Record<string, unknown> | null;
  lastAssessedAt: Date | null;
}

export async function getUserProgressions(
  userId: string
): Promise<UserProgressionStatus[]> {
  try {
    const [families, userProgressions] = await Promise.all([
      prisma.progressionFamily.findMany({
        include: {
          levels: {
            include: {
              exercise: true,
            },
            orderBy: { level: "asc" },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.userProgression.findMany({
        where: { userId },
      }),
    ]);

    const userProgressionMap = new Map(
      userProgressions.map((up) => [up.progressionFamilyId, up])
    );

    return families.map((family) => {
      const userProg = userProgressionMap.get(family.id);
      const currentLevel = userProg?.currentLevel ?? 1;
      const totalLevels = family.levels.length;

      const currentLevelData = family.levels.find(
        (l) => l.level === currentLevel
      );
      const nextLevelData = family.levels.find(
        (l) => l.level === currentLevel + 1
      );

      return {
        familyId: family.id,
        familyName: family.name,
        familySlug: family.slug,
        familyCategory: family.category,
        currentLevel,
        totalLevels,
        currentExercise: currentLevelData
          ? {
              id: currentLevelData.exercise.id,
              nameEn: currentLevelData.exercise.nameEn,
              name: currentLevelData.exercise.name,
              slug: currentLevelData.exercise.slug,
            }
          : null,
        nextExercise: nextLevelData
          ? {
              id: nextLevelData.exercise.id,
              nameEn: nextLevelData.exercise.nameEn,
              name: nextLevelData.exercise.name,
              slug: nextLevelData.exercise.slug,
            }
          : null,
        nextUnlockCriteria: nextLevelData
          ? (nextLevelData.unlockCriteria as Record<string, unknown>)
          : null,
        lastAssessedAt: userProg?.lastAssessedAt ?? null,
      };
    });
  } catch (error) {
    console.error("Error fetching user progressions:", error);
    return [];
  }
}
