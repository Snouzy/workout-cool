"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { CreateExerciseModal } from "./create-exercise-modal";

export function CreateExerciseButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
        <Plus className="h-4 w-4" />
        Créer un exercice
      </button>

      <CreateExerciseModal onOpenChangeAction={setIsModalOpen} open={isModalOpen} />
    </>
  );
}
