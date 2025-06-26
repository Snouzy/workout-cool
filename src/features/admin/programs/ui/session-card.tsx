"use client";

import { useState } from "react";
import { Plus, Clock, Dumbbell, Settings, ChevronDown, ChevronRight, Edit } from "lucide-react";

import { useI18n } from "locales/client";

import { SessionWithExercises } from "../types/program.types";
import { EditSetsModal } from "./edit-sets-modal";
import { EditSessionModal } from "./edit-session-modal";
import { AddExerciseModal } from "./add-exercise-modal";

interface SessionCardProps {
  session: SessionWithExercises;
}

export function SessionCard({ session }: SessionCardProps) {
  const t = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  return (
    <div className="card bg-base-100 shadow-sm border-l-4 border-l-primary">
      {/* Header avec boutons séparés du collapse */}
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost btn-sm p-1" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">
                  {t("programs.session")} {session.sessionNumber}: {session.title}
                </h4>
                <div className={`badge badge-sm ${session.isPremium ? "badge-primary" : "badge-outline"}`}>
                  {session.isPremium ? "Premium" : "Gratuit"}
                </div>
              </div>
              <p className="text-sm text-base-content/60">{session.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-base-content/60">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{session.estimatedMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" />
                  <span>
                    {session.exercises.length} exercice{session.exercises.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {session.equipment.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    <span>{session.equipment.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-outline" onClick={() => setIsEditSessionModalOpen(true)} title="Éditer la séance">
              <Edit className="h-4 w-4" />
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => setIsAddExerciseModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Exercice
            </button>
          </div>
        </div>
      </div>

      {/* Contenu collapsible */}
      {isExpanded && (
        <div className="card-body pt-0">
          <div className="divider my-2"></div>
          {session.exercises.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-base-300 rounded-lg">
              <Dumbbell className="h-8 w-8 text-base-content/60 mx-auto mb-2" />
              <p className="text-base-content/60 mb-3">Aucun exercice dans cette séance</p>
              <button className="btn btn-sm btn-primary" onClick={() => setIsAddExerciseModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter le premier exercice
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {session.exercises.map((exercise) => (
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg" key={exercise.id}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-semibold">
                      {exercise.order + 1}
                    </div>
                    <div>
                      <h5 className="font-medium">{exercise.exercise.name}</h5>
                      <p className="text-sm text-base-content/60">
                        {exercise.suggestedSets.length} série{exercise.suggestedSets.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-ghost" onClick={() => setSelectedExercise(exercise)} title="Éditer les séries">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AddExerciseModal
        nextOrder={session.exercises.length}
        onOpenChange={setIsAddExerciseModalOpen}
        open={isAddExerciseModalOpen}
        sessionId={session.id}
      />

      {selectedExercise && (
        <EditSetsModal exercise={selectedExercise} onOpenChange={(open) => !open && setSelectedExercise(null)} open={!!selectedExercise} />
      )}

      <EditSessionModal onOpenChange={setIsEditSessionModalOpen} open={isEditSessionModalOpen} session={session} />
    </div>
  );
}
