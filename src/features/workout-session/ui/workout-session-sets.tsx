"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Hourglass } from "lucide-react";
import confetti from "canvas-confetti";

import { useI18n } from "locales/client";
import Trophy from "@public/images/trophy.png";
import { cn } from "@/shared/lib/utils";
import { useWorkoutSession } from "@/features/workout-builder/model/use-workout-session";
import { Button } from "@/components/ui/button";

import { WorkoutSessionSet } from "./workout-session-set";

export function WorkoutSessionSets({
  showCongrats,
  onCongrats,
  sessionId,
}: {
  showCongrats: boolean;
  onCongrats: () => void;
  sessionId: string;
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
  } = useWorkoutSession(sessionId);
  const router = useRouter();

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
              {/* Nom de l'exercice */}
              <div
                className={cn(
                  "ml-2 text-xl",
                  idx === currentExerciseIndex
                    ? "font-bold text-blue-600"
                    : "text-slate-700 dark:text-slate-300 transition-colors hover:text-blue-500",
                )}
              >
                {ex.name}
              </div>
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
      {!showCongrats && (
        <div className="flex justify-center mt-8">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 text-lg rounded" onClick={handleFinishSession}>
            Terminer la séance
          </Button>
        </div>
      )}
    </div>
  );
}
