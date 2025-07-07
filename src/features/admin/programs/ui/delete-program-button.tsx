"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteProgram } from "../actions/delete-program.action";

interface DeleteProgramButtonProps {
  programId: string;
  programTitle: string;
}

export function DeleteProgramButton({ programId, programTitle }: DeleteProgramButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProgram(programId);
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting program:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button className="btn btn-outline btn-sm px-2" onClick={() => setIsModalOpen(true)}>
        <Trash2 className="h-4 w-4 text-error" />
      </button>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la suppression</h3>
            <p className="py-4">
              Êtes-vous sûr de vouloir supprimer le programme <strong>{programTitle}</strong> ? Cette action est irréversible. Au bout de 30
              jours, tu ne pourras plus accéder à ton compte, ni à tes données. Tu devras créer un nouveau compte si tu veux continuer à
              utiliser l&apos;application.
            </p>
            {/* Warning if program has enrollments */}
            <div className="alert alert-warning">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>Cette action supprimera toutes les semaines, séances et exercices associés.</span>
            </div>
            <div className="modal-action">
              <button className="btn btn-outline" disabled={isDeleting} onClick={() => setIsModalOpen(false)}>
                Annuler
              </button>
              <button className="btn btn-error" disabled={isDeleting} onClick={handleDelete}>
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
