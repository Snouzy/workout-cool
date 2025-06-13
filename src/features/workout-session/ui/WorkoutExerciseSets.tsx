import { useI18n } from "locales/client";
import { useWorkoutSession } from "@/features/workout-builder/model/use-workout-session";
import { Button } from "@/components/ui/button";

import { WorkoutSetRow } from "./WorkoutSetRow";

export function WorkoutExerciseSets() {
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
  } = useWorkoutSession();

  if (!session) {
    return <div className="text-center text-slate-500 py-12">{t("workout_builder.session.no_exercise_selected")}</div>;
  }

  const handleExerciseClick = (targetIndex: number) => {
    if (targetIndex !== currentExerciseIndex) {
      goToExercise(targetIndex);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h4 className="font-bold mb-8 text-lg">{t("workout_builder.session.exercise_progress")}</h4>
      <ol className="relative border-l-2 border-slate-200 dark:border-slate-700">
        {session.exercises.map((ex, idx) => (
          <li
            className={`mb-8 ml-4 ${idx !== currentExerciseIndex ? "cursor-pointer hover:opacity-80" : ""}`}
            key={ex.id}
            onClick={() => handleExerciseClick(idx)}
          >
            {/* Cercle étape */}
            <span
              className={
                idx === currentExerciseIndex
                  ? "absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full border-4 border-blue-500 bg-blue-500 z-10"
                  : "absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full border-4 border-slate-200 bg-white z-10"
              }
            >
              {idx === currentExerciseIndex ? <span className="w-4 h-4 rounded-full bg-white block"></span> : null}
            </span>
            {/* Nom de l'exercice */}
            <div
              className={
                idx === currentExerciseIndex
                  ? "font-bold text-blue-600 text-xl mb-2"
                  : "text-slate-700 dark:text-slate-300 text-xl mb-2 transition-colors hover:text-blue-500"
              }
            >
              {ex.name}
            </div>
            {/* Si exercice courant, afficher le détail */}
            {idx === currentExerciseIndex && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md p-6 mt-2 mb-2">
                {/* Liste des sets */}
                <div className="space-y-4 mb-8">
                  {ex.sets.map((set, setIdx) => (
                    <WorkoutSetRow
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
        ))}
      </ol>
    </div>
  );
}
