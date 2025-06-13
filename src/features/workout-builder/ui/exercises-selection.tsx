import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";

import { Button } from "@/components/ui/button";

import { useWorkoutStepper } from "../model/use-workout-stepper";
import { ExerciseListItem } from "./exercise-list-item";

import type { ExerciseWithAttributes } from "../types";
import type { TFunction } from "../../../../locales/client";

interface ExercisesSelectionProps {
  isLoading: boolean;
  exercisesByMuscle: { muscle: string; exercises: ExerciseWithAttributes[] }[];
  error: any;
  onShuffle: (exerciseId: string, muscle: string) => void;
  onPick: (exerciseId: string) => void;
  onDelete: (exerciseId: string, muscle: string) => void;
  onAdd: () => void;
  onStartWorkout: (exercises: ExerciseWithAttributes[]) => void;
  t: TFunction;
}

export const ExercisesSelection = ({
  isLoading,
  exercisesByMuscle,
  error,
  onShuffle,
  onPick,
  onDelete,
  onAdd,
  onStartWorkout,
  t,
}: ExercisesSelectionProps) => {
  const [flatExercises, setFlatExercises] = useState<{ id: string; muscle: string; exercise: ExerciseWithAttributes }[]>([]);
  const { setExercisesOrder } = useWorkoutStepper();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  useEffect(() => {
    if (exercisesByMuscle.length > 0) {
      const flat = exercisesByMuscle.flatMap((group) =>
        group.exercises.map((exercise) => ({
          id: exercise.id,
          muscle: group.muscle,
          exercise,
        })),
      );
      setFlatExercises(flat);
    } else {
      setFlatExercises([]);
    }
  }, [exercisesByMuscle]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFlatExercises((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setExercisesOrder(newOrder.map((item) => item.id));
        return newOrder;
      });
    }
  };

  const handleStartWorkout = () => {
    const allExercises = flatExercises.map((item) => item.exercise);
    if (allExercises.length > 0) {
      onStartWorkout(allExercises);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">{t("workout_builder.loading.exercises")}</p>
        </div>
      ) : flatExercises.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          {/* Liste des exercices drag and drop */}
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={flatExercises.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                {flatExercises.map((item) => (
                  <ExerciseListItem
                    exercise={item.exercise}
                    isPicked={true}
                    key={item.id}
                    muscle={item.muscle}
                    onDelete={onDelete}
                    onPick={onPick}
                    onShuffle={onShuffle}
                  />
                ))}
                <div className="border-t border-slate-200 dark:border-slate-800">
                  <button
                    className="w-full flex items-center gap-3 py-4 px-4 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                    onClick={onAdd}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">Add</span>
                  </button>
                </div>
              </div>
            </SortableContext>
          </DndContext>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              className="px-8 bg-blue-600 hover:bg-blue-700"
              disabled={flatExercises.length === 0}
              onClick={handleStartWorkout}
              size="large"
            >
              Start Workout
            </Button>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 dark:text-red-400">{t("workout_builder.error.loading_exercises")}</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-600 dark:text-slate-400">{t("workout_builder.no_exercises_found")}</p>
        </div>
      )}
    </div>
  );
};
