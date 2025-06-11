"use client";

import { useQuery } from "@tanstack/react-query";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { getExercisesAction } from "./get-exercises.action";

interface UseExercisesProps {
  equipment: ExerciseAttributeValueEnum[];
  muscles: ExerciseAttributeValueEnum[];
  enabled?: boolean;
}

export function useExercises({ equipment, muscles, enabled = true }: UseExercisesProps) {
  return useQuery({
    queryKey: ["exercises", equipment.sort(), muscles.sort()],
    queryFn: async () => {
      if (equipment.length === 0 || muscles.length === 0) {
        return [];
      }

      const result = await getExercisesAction({
        equipment,
        muscles,
        limit: 3,
      });

      if (result?.serverError) {
        throw new Error(result.serverError);
      }

      return result?.data || [];
    },
    enabled: enabled && equipment.length > 0 && muscles.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
