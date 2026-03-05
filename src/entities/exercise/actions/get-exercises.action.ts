"use server";

import { type MuscleGroup, Prisma } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

export interface ExerciseFilters {
  search?: string;
  category?: string;
  muscle?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}

export interface ExerciseListItem {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  category: string;
  difficultyLevel: string;
  primaryMuscles: string[];
  measurementType: string;
  videoUrl: string | null;
  imageUrls: string[];
}

export interface ExerciseListResult {
  exercises: ExerciseListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getExercises(filters: ExerciseFilters): Promise<ExerciseListResult> {
  try {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const conditions: Prisma.ExerciseWhereInput[] = [];

    if (filters.search) {
      conditions.push({
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { nameEn: { contains: filters.search, mode: "insensitive" } },
        ],
      });
    }

    if (filters.muscle) {
      conditions.push({ primaryMuscles: { has: filters.muscle as MuscleGroup } });
    }

    if (filters.category) {
      conditions.push({ category: filters.category as Prisma.EnumExerciseCategoryFilter["equals"] });
    }

    if (filters.difficulty) {
      conditions.push({ difficultyLevel: filters.difficulty as Prisma.EnumDifficultyLevelFilter["equals"] });
    }

    const whereClause: Prisma.ExerciseWhereInput = conditions.length > 0 ? { AND: conditions } : {};

    const [total, exercises] = await Promise.all([
      prisma.exercise.count({ where: whereClause }),
      prisma.exercise.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          nameEn: true,
          slug: true,
          category: true,
          difficultyLevel: true,
          primaryMuscles: true,
          measurementType: true,
          videoUrl: true,
          imageUrls: true,
        },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      exercises: exercises.map((e) => ({
        id: e.id,
        name: e.name,
        nameEn: e.nameEn,
        slug: e.slug,
        category: e.category,
        difficultyLevel: e.difficultyLevel,
        primaryMuscles: e.primaryMuscles,
        measurementType: e.measurementType,
        videoUrl: e.videoUrl,
        imageUrls: e.imageUrls,
      })),
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return { exercises: [], total: 0, page: 1, totalPages: 0 };
  }
}
