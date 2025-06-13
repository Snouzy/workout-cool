import { z } from "zod";

export const workoutSessionSetSchema = z.object({
  id: z.string(),
  setIndex: z.number().int().min(0),
  type: z.enum(["TIME", "WEIGHT", "REPS", "BODYWEIGHT", "NA"]),
  types: z.array(z.enum(["TIME", "WEIGHT", "REPS", "BODYWEIGHT", "NA"])).optional(),
  valueInt: z.number().int().optional(),
  valuesInt: z.array(z.number().int()).optional(),
  valueSec: z.number().int().min(0).max(59).optional(),
  valuesSec: z.array(z.number().int().min(0).max(59)).optional(),
  unit: z.enum(["kg", "lbs"]).optional(),
  units: z.array(z.enum(["kg", "lbs"])).optional(),
  completed: z.boolean(),
});

export type WorkoutSetInput = z.infer<typeof workoutSessionSetSchema>;
