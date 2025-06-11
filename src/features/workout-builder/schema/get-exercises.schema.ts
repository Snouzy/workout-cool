import { z } from "zod";
import { ExerciseAttributeValueEnum } from "@prisma/client";

export const getExercisesSchema = z.object({
  equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)).min(1, "Au moins un équipement est requis"),
  muscles: z.array(z.nativeEnum(ExerciseAttributeValueEnum)).min(1, "Au moins un muscle est requis"),
  limit: z.number().int().min(1).max(10).default(3),
});

export type GetExercisesInput = z.infer<typeof getExercisesSchema>;
