import { z } from "zod";

export const workoutSetSchema = z.object({
  id: z.string(),
  setIndex: z.number().int().min(0),
  type: z.enum(["TIME", "WEIGHT", "REPS", "BODYWEIGHT", "NA"]),
  valueInt: z.number().int().optional(),
  valueSec: z.number().int().min(0).max(59).optional(),
  unit: z.enum(["kg", "lbs"]).optional(),
  completed: z.boolean(),
});

export type WorkoutSetInput = z.infer<typeof workoutSetSchema>;
