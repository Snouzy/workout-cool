import { Search, Heart, Users, BarChart3 } from "lucide-react";

import { EditExerciseButton } from "@/features/admin/exercises/ui/edit-exercise-button";
import { DeleteExerciseButton } from "@/features/admin/exercises/ui/delete-exercise-button";
import { getExercises } from "@/features/admin/exercises/actions/get-exercises.action";

export async function ExercisesList() {
  const exercises = await getExercises();

  if (exercises.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-base-content/60 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun exercice</h3>
          <p className="text-base-content/60 text-center max-w-md">Commencez par créer votre premier exercice.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Exercice</th>
            <th>Attributs</th>
            <th>Utilisation</th>
            <th>Favoris</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise.id}>
              <td>
                <div className="flex flex-col">
                  <div className="font-bold">{exercise.name}</div>
                  <div className="text-sm opacity-50">{exercise.nameEn}</div>
                  {exercise.description && <div className="text-xs opacity-70 line-clamp-2 max-w-xs mt-1">{exercise.description}</div>}
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {exercise.attributes.slice(0, 3).map((attr) => (
                    <div
                      className="badge badge-xs badge-outline"
                      key={attr.id}
                      title={`${attr.attributeName.name}: ${attr.attributeValue.value}`}
                    >
                      {attr.attributeValue.value}
                    </div>
                  ))}
                  {exercise.attributes.length > 3 && <div className="badge badge-xs badge-ghost">+{exercise.attributes.length - 3}</div>}
                </div>
              </td>
              <td>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 opacity-50" />
                    <span>{exercise.totalProgramUsage} programmes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 opacity-50" />
                    <span>{exercise.totalWorkoutUsage} séances</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 opacity-50" />
                  <span className="font-semibold">{exercise.totalFavorites}</span>
                </div>
              </td>
              <td>
                <div className="flex gap-1">
                  <EditExerciseButton exercise={exercise} />
                  <DeleteExerciseButton
                    canDelete={exercise.totalProgramUsage === 0 && exercise.totalWorkoutUsage === 0}
                    exerciseId={exercise.id}
                    exerciseName={exercise.name}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
