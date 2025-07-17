"use client";

import React, { useState } from "react";

import { ExercisesBrowser } from "@/features/statistics/components/ExercisesBrowser";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

export default function ExercisesPage() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAttributes | null>(null);

  const handleExerciseSelect = (exercise: ExerciseWithAttributes) => {
    setSelectedExercise(exercise);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 max-w-7xl">
      <ExercisesBrowser onExerciseSelect={handleExerciseSelect} />
    </div>
  );
}
