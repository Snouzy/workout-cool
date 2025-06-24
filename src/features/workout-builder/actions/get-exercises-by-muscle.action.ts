"use server";

import { z } from "zod";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";


const getExercisesByMuscleSchema = z.object({
  equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
});

export const getExercisesByMuscleAction = actionClient
  .schema(getExercisesByMuscleSchema)
  .action(async ({ parsedInput }) => {
    const { equipment } = parsedInput;

    try {
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

      const muscleGroups = [
        ExerciseAttributeValueEnum.CHEST,
        ExerciseAttributeValueEnum.BACK,
        ExerciseAttributeValueEnum.SHOULDERS,
        ExerciseAttributeValueEnum.BICEPS,
        ExerciseAttributeValueEnum.TRICEPS,
        ExerciseAttributeValueEnum.QUADRICEPS,
        ExerciseAttributeValueEnum.HAMSTRINGS,
        ExerciseAttributeValueEnum.GLUTES,
        ExerciseAttributeValueEnum.CALVES,
        ExerciseAttributeValueEnum.ABDOMINALS,
        ExerciseAttributeValueEnum.FOREARMS,
        ExerciseAttributeValueEnum.TRAPS,
        ExerciseAttributeValueEnum.LATS,
      ];

      const exercisesByMuscle = await Promise.all(
        muscleGroups.map(async (muscle) => {
          const exercises = await prisma.exercise.findMany({
            where: {
              AND: [
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
                // Exclude stretching exercises
                {
                  NOT: {
                    attributes: {
                      some: {
                        attributeValue: {
                          value: "STRETCHING",
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
            orderBy: {
              nameEn: "asc",
            },
          });

          return {
            muscle,
            exercises,
          };
        })
      );

      // Filter out muscle groups with no exercises
      return exercisesByMuscle.filter(group => group.exercises.length > 0);
    } catch (error) {
      console.error("Error fetching exercises by muscle:", error);
      throw new Error("Error fetching exercises by muscle");
    }
  });