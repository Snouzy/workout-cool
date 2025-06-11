"use server";

import { ExerciseAttributeNameEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";

import { getExercisesSchema } from "../schema/get-exercises.schema";

// Utility function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const getExercisesAction = actionClient.schema(getExercisesSchema).action(async ({ parsedInput }) => {
  const { equipment, muscles, limit } = parsedInput;

  try {
    // First, get the attribute name IDs once
    const [primaryMuscleAttributeName, equipmentAttributeName] = await Promise.all([
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.PRIMARY_MUSCLE },
      }),
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.EQUIPMENT },
      }),
    ]);

    if (!primaryMuscleAttributeName || !equipmentAttributeName) {
      throw new Error("Missing attributes in database");
    }

    // Get exercises for each selected muscle
    const exercisesByMuscle = await Promise.all(
      muscles.map(async (muscle) => {
        // Get more exercises than needed to allow for randomization
        // We get 3x the limit to have a good selection pool
        const allExercises = await prisma.exercise.findMany({
          where: {
            AND: [
              // Must have this muscle as primary muscle
              {
                attributes: {
                  some: {
                    attributeNameId: primaryMuscleAttributeName.id,
                    attributeValue: {
                      value: muscle,
                    },
                  },
                },
              },
              // Must have at least one of the selected equipment
              {
                attributes: {
                  some: {
                    attributeNameId: equipmentAttributeName.id,
                    attributeValue: {
                      value: {
                        in: equipment,
                      },
                    },
                  },
                },
              },
            ],
          },
          include: {
            attributes: {
              include: {
                attributeName: true,
                attributeValue: true,
              },
            },
          },
          // Get more exercises to have choice
          take: Math.max(limit * 3, 20), // At least 20 exercises or 3x the limit
        });

        // Shuffle exercises and take only the requested number
        const shuffledExercises = shuffleArray(allExercises);
        const selectedExercises = shuffledExercises.slice(0, limit);

        return {
          muscle,
          exercises: selectedExercises,
        };
      }),
    );

    // Filter muscles that have no exercises
    const filteredResults = exercisesByMuscle.filter((group) => group.exercises.length > 0);

    return filteredResults;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw new Error("Error fetching exercises");
  }
});
