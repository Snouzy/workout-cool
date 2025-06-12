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
        {/* TODO: Intégrer WorkoutStepper */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4">
          <h4 className="font-bold mb-4">{t("workout_builder.session.exercise_progress")}</h4>
          <ol className="space-y-2">
            {session.exercises.map((ex, idx) => (
              <li className={idx === currentExerciseIndex ? "font-bold text-blue-600" : "text-slate-700 dark:text-slate-300"} key={ex.id}>
                {idx + 1}. {/* TODO: Afficher le nom de l'exercice (récupérer via ExerciseWithAttributes si besoin) */}
                {ex.exerciseId}
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1">
        {/* Nom de l'exercice courant */}
        <h2 className="text-2xl font-bold mb-6">
          {/* TODO: Afficher le nom réel de l'exercice */}Exercice #{currentExerciseIndex + 1}
        </h2>

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
