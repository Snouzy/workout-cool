"use server";

import { ExerciseAttributeNameEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";

import { getExercisesSchema } from "../schema/get-exercises.schema";

export const getExercisesAction = actionClient.schema(getExercisesSchema).action(async ({ parsedInput }) => {
  const { equipment, muscles, limit } = parsedInput;

  try {
    // Récupérer d'abord les IDs des noms d'attributs une seule fois
    const [primaryMuscleAttributeName, equipmentAttributeName] = await Promise.all([
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.PRIMARY_MUSCLE },
      }),
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.EQUIPMENT },
      }),
    ]);

    if (!primaryMuscleAttributeName || !equipmentAttributeName) {
      throw new Error("Attributs manquants dans la base de données");
    }

    // Récupérer les exercices pour chaque muscle sélectionné
    const exercisesByMuscle = await Promise.all(
      muscles.map(async (muscle) => {
        // Récupérer les exercices qui ont ce muscle comme muscle primaire
        // ET qui utilisent au moins un des équipements sélectionnés
        const exercises = await prisma.exercise.findMany({
          where: {
            AND: [
              // Doit avoir le muscle comme muscle primaire
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
              // Doit avoir au moins un des équipements sélectionnés
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
          take: limit,
        });

        return {
          muscle,
          exercises,
        };
      }),
    );

    // Filtrer les muscles qui n'ont pas d'exercices
    const filteredResults = exercisesByMuscle.filter((group) => group.exercises.length > 0);

    return filteredResults;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw new Error("Erreur lors de la récupération des exercices");
  }
});
