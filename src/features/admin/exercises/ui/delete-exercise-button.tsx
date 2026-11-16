"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteExercise } from "../actions/delete-exercise.action";

interface DeleteExerciseButtonProps {
  exerciseId: string;
  exerciseName: string;
  canDelete: boolean;
}

export function DeleteExerciseButton({ exerciseId, exerciseName, canDelete }: DeleteExerciseButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExercise(exerciseId);
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting exercise:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        className={`btn btn-ghost btn-xs ${!canDelete ? "btn-disabled" : ""}`}
        disabled={!canDelete}
        onClick={() => setIsModalOpen(true)}
        title={canDelete ? "Supprimer l'exercice" : "Impossible de supprimer: exercice utilisé"}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirmer la suppression</h3>
            <p className="py-4">
              {"Êtes-vous sûr de vouloir supprimer l'exercice "}
              <strong>{exerciseName}</strong> ?
            </p>
            <p className="text-sm text-warning mb-4">Cette action est irréversible.</p>
            <div className="modal-action">
              <button className="btn btn-outline" disabled={isDeleting} onClick={() => setIsModalOpen(false)}>
                Annuler
              </button>
              <button className="btn btn-error" disabled={isDeleting} onClick={handleDelete}>
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
