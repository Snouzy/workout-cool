"use server";

import { prisma } from "@/shared/lib/prisma";

export interface ProgressionFamilyDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  levels: Array<{
    level: number;
    exercise: {
      id: string;
      name: string;
      nameEn: string | null;
      slug: string;
      difficultyLevel: string;
      measurementType: string;
      description: string;
    };
    unlockCriteria: Record<string, unknown>;
  }>;
}

export async function getProgressionFamily(
  familySlug: string
): Promise<ProgressionFamilyDetail | null> {
  try {
    const family = await prisma.progressionFamily.findUnique({
      where: { slug: familySlug },
      include: {
        levels: {
          include: {
            exercise: true,
          },
          orderBy: { level: "asc" },
        },
      },
    });

    if (!family) {
      return null;
    }

    return {
      id: family.id,
      name: family.name,
      slug: family.slug,
      description: family.description,
      category: family.category,
      levels: family.levels.map((level) => ({
        level: level.level,
        exercise: {
          id: level.exercise.id,
          name: level.exercise.name,
          nameEn: level.exercise.nameEn,
          slug: level.exercise.slug,
          difficultyLevel: level.exercise.difficultyLevel,
          measurementType: level.exercise.measurementType,
          description: level.exercise.description,
        },
        unlockCriteria: level.unlockCriteria as Record<string, unknown>,
      })),
    };
  } catch (error) {
    console.error("Error fetching progression family:", error);
    return null;
  }
}
