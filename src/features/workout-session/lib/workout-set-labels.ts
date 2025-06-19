import { TFunction } from "locales/client";

import { WorkoutSetType } from "../types/workout-set";

export function getWorkoutSetTypeLabels(t: TFunction): Record<WorkoutSetType, string> {
  return {
    TIME: t("workout_builder.session.time"),
    WEIGHT: t("workout_builder.session.weight"),
    REPS: t("workout_builder.session.reps"),
    BODYWEIGHT: t("workout_builder.session.bodyweight"),
    NA: "N/A",
  };
}
