import { Suspense } from "react";

import { ExercisesList } from "@/features/admin/exercises/ui/exercises-list";
import { CreateExerciseButton } from "@/features/admin/exercises/ui/create-exercise-button";

export default function AdminExercises() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
          <p className="text-muted-foreground">Create, edit, view and delete exercises.</p>
        </div>
        <CreateExerciseButton />
      </div>

      <Suspense fallback={<div>Loading exercises...</div>}>
        <ExercisesList />
      </Suspense>
    </div>
  );
}
