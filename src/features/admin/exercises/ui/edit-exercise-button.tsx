"use client";

import { useState } from "react";
import { Edit } from "lucide-react";

import { ExerciseWithStats } from "../types/exercise.types";
import { EditExerciseModal } from "./edit-exercise-modal";

interface EditExerciseButtonProps {
  exercise: ExerciseWithStats;
}

export function EditExerciseButton({ exercise }: EditExerciseButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="btn btn-ghost btn-xs" onClick={() => setIsModalOpen(true)} title="Modifier l'exercice">
        <Edit className="h-4 w-4" />
      </button>

      <EditExerciseModal exercise={exercise} onOpenChangeAction={setIsModalOpen} open={isModalOpen} />
    </>
  );
}
