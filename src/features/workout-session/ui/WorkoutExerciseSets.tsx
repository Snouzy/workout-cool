import { useI18n } from "locales/client";
import { useWorkoutSession } from "@/features/workout-builder/model/use-workout-session";
import { Button } from "@/components/ui/button";

import { WorkoutSetRow } from "./WorkoutSetRow";

export function WorkoutExerciseSets() {
  const t = useI18n();
  const { currentExercise, currentExerciseIndex, session, addSet, updateSet, removeSet, finishSet, goToNextExercise, goToPrevExercise } =
    useWorkoutSession();

  if (!currentExercise || !session) {
    return <div className="text-center text-slate-500 py-12">{t("workout_builder.session.no_exercise_selected")}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Stepper vertical (à gauche sur desktop) */}
      <aside className="hidden md:block w-64">
        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4">
          <h4 className="font-bold mb-4">{t("workout_builder.session.exercise_progress")}</h4>
          <ol className="space-y-4">
            {session.exercises.map((ex, idx) => (
              <li className="flex items-center gap-3" key={ex.id}>
                <span
                  className={
                    idx === currentExerciseIndex
                      ? "flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500"
                      : "flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-200"
                  }
                >
                  {idx === currentExerciseIndex ? <span className="w-3 h-3 rounded-full bg-white block"></span> : null}
                </span>
                <span
                  className={
                    idx === currentExerciseIndex ? "font-bold text-blue-600 text-lg" : "text-slate-700 dark:text-slate-300 text-lg"
                  }
                >
                  {ex.name}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1">
        {/* Nom de l'exercice courant */}
        <h2 className="text-2xl font-bold mb-6">{currentExercise.name}</h2>

        {/* Liste des sets */}
        <div className="space-y-4 mb-8">
          {currentExercise.sets.map((set, idx) => (
            <WorkoutSetRow
              key={set.id}
              onChange={updateSet}
              onFinish={() => finishSet(idx)}
              onRemove={() => removeSet(idx)}
              set={set}
              setIndex={idx}
            />
          ))}
        </div>

        {/* Actions bas de page */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button className="bg-blue-500 text-white flex-1" onClick={addSet}>
            {t("workout_builder.session.add_set") || "Add a set"}
          </Button>
          <Button className="bg-blue-700 text-white flex-1" onClick={goToNextExercise}>
            {t("workout_builder.session.next_exercise") || "Next Exercise"}
          </Button>
        </div>
      </main>
    </div>
  );
}
