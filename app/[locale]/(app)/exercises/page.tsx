"use client";

import React, { useState } from "react";

import { ExerciseForStatistics } from "@/shared/types/statistics.types";
import { ExercisesBrowser } from "@/features/statistics/components/ExercisesBrowser";

export default function ExercisesPage() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseForStatistics | null>(null);

  const handleExerciseSelect = (exercise: ExerciseForStatistics) => {
    setSelectedExercise(exercise);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ExercisesBrowser onExerciseSelect={handleExerciseSelect} />
    </div>
  );
}
