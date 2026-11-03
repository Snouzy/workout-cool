"use server";

import { z } from "zod";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { buildEquipmentRequirementsFilter } from "@/shared/lib/exercise-equipment";
import { actionClient } from "@/shared/api/safe-actions";

const shuffleExerciseSchema = z.object({
  muscle: z.nativeEnum(ExerciseAttributeValueEnum),
  equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
  excludeExerciseIds: z.array(z.string()),
});

export const shuffleExerciseAction = actionClient.schema(shuffleExerciseSchema).action(async ({ parsedInput }) => {
  const { muscle, equipment, excludeExerciseIds } = parsedInput;

  try {
    const [primaryMuscleAttributeName, secondaryMuscleAttributeName, equipmentAttributeName] = await Promise.all([
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.PRIMARY_MUSCLE },
      }),
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.SECONDARY_MUSCLE },
      }),
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.EQUIPMENT },
      }),
    ]);

    if (!primaryMuscleAttributeName || !secondaryMuscleAttributeName || !equipmentAttributeName) {
      throw new Error("Missing attributes in database");
    }

    const primaryExercises = await prisma.exercise.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: excludeExerciseIds,
            },
          },
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
            AND: buildEquipmentRequirementsFilter(equipment, equipmentAttributeName.id),
          },
          {
            NOT: {
              attributes: {
                some: {
                  attributeValue: {
                    value: ExerciseAttributeValueEnum.STRETCHING,
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
      take: 50,
    });

    let allExercises = [...primaryExercises];

    if (allExercises.length < 3) {
      const secondaryExercises = await prisma.exercise.findMany({
        where: {
          AND: [
            {
              id: {
                notIn: [...excludeExerciseIds, ...primaryExercises.map((ex) => ex.id)],
              },
            },
            {
              attributes: {
                some: {
                  attributeNameId: secondaryMuscleAttributeName.id,
                  attributeValue: {
                    value: muscle,
                  },
                },
              },
            },
            {
              AND: buildEquipmentRequirementsFilter(equipment, equipmentAttributeName.id),
            },
            {
              NOT: {
                attributes: {
                  some: {
                    attributeValue: {
                      value: ExerciseAttributeValueEnum.STRETCHING,
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
        take: 50 - primaryExercises.length,
      });

      allExercises = [...allExercises, ...secondaryExercises];
    }

    if (allExercises.length === 0) {
      return { serverError: "No alternative exercises found" };
    }

    const randomIndex = Math.floor(Math.random() * allExercises.length);
    const selectedExercise = allExercises[randomIndex];

    return { exercise: selectedExercise };
  } catch (error) {
    console.error("Error shuffling exercise:", error);
    return { serverError: "Failed to shuffle exercise" };
  }
});
