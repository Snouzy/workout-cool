"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Hourglass, Play } from "lucide-react";
import confetti from "canvas-confetti";

import { useI18n } from "locales/client";
import Trophy from "@public/images/trophy.png";
import { cn } from "@/shared/lib/utils";
import { ExerciseVideoModal } from "@/features/workout-builder/ui/exercise-video-modal";
import { Button } from "@/components/ui/button";

import { WorkoutSessionSet } from "./workout-session-set";

import { useWorkoutSession } from "@/features/workout-session/model/use-workout-session";

export function WorkoutSessionSets({
  showCongrats,
  onCongrats,
  isWorkoutActive,
}: {
  showCongrats: boolean;
  onCongrats: () => void;
  isWorkoutActive: boolean;
}) {
  const t = useI18n();
  const {
    currentExercise,
    currentExerciseIndex,
    session,
    addSet,
    updateSet,
    removeSet,
    finishSet,
    goToNextExercise,
    goToPrevExercise,
    goToExercise,
    completeWorkout,
  } = useWorkoutSession();
  const router = useRouter();
  const exerciseDetailsMap = Object.fromEntries(session?.exercises.map((ex) => [ex.id, ex]) || []);
  const [videoModal, setVideoModal] = useState<{ open: boolean; exerciseId?: string }>({ open: false });

  if (!session) {
    return <div className="text-center text-slate-500 py-12">{t("workout_builder.session.no_exercise_selected")}</div>;
  }

  const handleExerciseClick = (targetIndex: number) => {
    if (targetIndex !== currentExerciseIndex) {
      goToExercise(targetIndex);
    }
  };

  const renderStepIcon = (idx: number, allSetsCompleted: boolean) => {
    if (allSetsCompleted) {
      return <Check aria-label="Exercice terminé" className="w-4 h-4 text-white" />;
    }
    if (idx === currentExerciseIndex) {
      return <Hourglass aria-label="Exercice en cours" className="w-4 h-4 text-white" />;
    }

    return null;
  };

  const renderStepBackground = (idx: number, allSetsCompleted: boolean) => {
    if (allSetsCompleted) {
      return "bg-green-500 border-green-500";
    }
    if (idx === currentExerciseIndex) {
      return "bg-blue-500 border-blue-500";
    }
    return "bg-slate-200 border-slate-200";
  };

  const handleFinishSession = () => {
    completeWorkout();
    onCongrats();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  if (showCongrats) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Image alt="Trophée" className="w-56 h-56" src={Trophy} />
        <h2 className="text-2xl font-bold mb-2">Bravo, séance terminée ! 🎉</h2>
        <p className="text-lg text-slate-600 mb-6">Tu as complété tous tes exercices.</p>
        <Button onClick={() => router.push("/profile")}>{t("commons.go_to_profile")}</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-8">
      <ol className="relative border-l-2 ml-2 border-slate-200 dark:border-slate-700">
        {session.exercises.map((ex, idx) => {
          const allSetsCompleted = ex.sets.length > 0 && ex.sets.every((set) => set.completed);
          const details = exerciseDetailsMap[ex.id];
          return (
            <li
              className={`mb-8 ml-4 ${idx !== currentExerciseIndex ? "cursor-pointer hover:opacity-80" : ""}`}
              key={ex.id}
              onClick={() => handleExerciseClick(idx)}
            >
              {/* Cercle étape */}
              <span
                className={cn(
                  "absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full border-4 z-10",
                  renderStepBackground(idx, allSetsCompleted),
                )}
              >
                {renderStepIcon(idx, allSetsCompleted)}
              </span>
              {/* Image + nom de l'exercice */}
              <div className="flex items-center gap-3 ml-2 hover:opacity-80">
                {details?.fullVideoImageUrl && (
                  <div
                    className="relative aspect-video max-w-24 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoModal({ open: true, exerciseId: ex.id });
                    }}
                  >
                    <Image
                      alt={details.name || details.nameEn || ""}
                      className="w-full h-full object-cover scale-[1.5]"
                      height={48}
                      src={details.fullVideoImageUrl}
                      width={48}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <Button className="bg-white/80" size="icon" variant="ghost">
                        <Play className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "text-xl",
                    idx === currentExerciseIndex
                      ? "font-bold text-blue-600"
                      : "text-slate-700 dark:text-slate-300 transition-colors hover:text-blue-500",
                  )}
                >
                  {ex.name}
                  {details?.introduction && (
                    <span
                      className="block text-xs mt-1 text-slate-500 dark:text-slate-400 underline cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoModal({ open: true, exerciseId: ex.id });
                      }}
                    >
                      Voir les instructions
                    </span>
                  )}
                  {/* Fallback: description si pas d'introduction */}
                </div>
              </div>
              {/* Modale vidéo */}
              {details && details.fullVideoUrl && videoModal.open && videoModal.exerciseId === ex.id && (
                <ExerciseVideoModal
                  exercise={details}
                  onOpenChange={(open) => setVideoModal({ open, exerciseId: open ? ex.id : undefined })}
                  open={videoModal.open}
                />
              )}
              {/* Si exercice courant, afficher le détail */}
              {idx === currentExerciseIndex && (
                <div className="bg-white dark:bg-slate-900 rounded-xl my-10">
                  {/* Liste des sets */}
                  <div className="space-y-10 mb-8">
                    {ex.sets.map((set, setIdx) => (
                      <WorkoutSessionSet
                        key={set.id}
                        onChange={(sIdx: number, data: Partial<typeof set>) => updateSet(idx, sIdx, data)}
                        onFinish={() => finishSet(idx, setIdx)}
                        onRemove={() => removeSet(idx, setIdx)}
                        set={set}
                        setIndex={setIdx}
                      />
                    ))}
                  </div>
                  {/* Actions bas de page */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button className="bg-blue-500 text-white flex-1 text-lg font-bold py-3" onClick={addSet}>
                      {t("workout_builder.session.add_set")}
                    </Button>
                    <Button className="bg-blue-700 text-white flex-1 text-lg font-bold py-3" onClick={goToNextExercise}>
                      {t("workout_builder.session.next_exercise")}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {!showCongrats && isWorkoutActive && (
        <div className="flex justify-center mt-8">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 text-lg rounded" onClick={handleFinishSession}>
            Terminer la séance
          </Button>
        </div>
      )}
    </div>
  );
}
