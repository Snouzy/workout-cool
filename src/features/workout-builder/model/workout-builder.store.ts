import { create } from "zustand";
import { ExerciseAttributeValueEnum, WorkoutSessionExercise } from "@prisma/client";

import { WorkoutBuilderStep } from "../types";
import { shuffleExerciseAction } from "../actions/shuffle-exercise.action";
import { pickExerciseAction } from "../actions/pick-exercise.action";
import { getExercisesAction } from "./get-exercises.action";

interface WorkoutBuilderState {
  currentStep: WorkoutBuilderStep;
  selectedEquipment: ExerciseAttributeValueEnum[];
  selectedMuscles: ExerciseAttributeValueEnum[];

  exercisesByMuscle: any[]; //TODO: type this
  isLoadingExercises: boolean;
  exercisesError: any; //TODO: type this
  exercisesOrder: string[];
  isShuffling: boolean;

  // Actions
  setStep: (step: WorkoutBuilderStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  toggleEquipment: (equipment: ExerciseAttributeValueEnum) => void;
  clearEquipment: () => void;
  toggleMuscle: (muscle: ExerciseAttributeValueEnum) => void;
  clearMuscles: () => void;
  fetchExercises: () => Promise<void>;
  setExercisesOrder: (order: string[]) => void;
  shuffleExercise: (exerciseId: string, muscle: ExerciseAttributeValueEnum) => Promise<void>;
  pickExercise: (exerciseId: string) => Promise<void>;
  deleteExercise: (exerciseId: string) => void;
  loadFromSession: (params: {
    equipment: ExerciseAttributeValueEnum[];
    muscles: ExerciseAttributeValueEnum[];
    exercisesByMuscle: {
      muscle: ExerciseAttributeValueEnum;
      exercises: WorkoutSessionExercise[];
    }[];
    exercisesOrder: string[];
  }) => void;
}

export const useWorkoutBuilderStore = create<WorkoutBuilderState>((set, get) => ({
  currentStep: 1 as WorkoutBuilderStep,
  selectedEquipment: [],
  selectedMuscles: [],
  exercisesByMuscle: [],
  isLoadingExercises: false,
  exercisesError: null,
  exercisesOrder: [],
  isShuffling: false,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) as WorkoutBuilderStep })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as WorkoutBuilderStep })),

  toggleEquipment: (equipment) =>
    set((state) => ({
      selectedEquipment: state.selectedEquipment.includes(equipment)
        ? state.selectedEquipment.filter((e) => e !== equipment)
        : [...state.selectedEquipment, equipment],
    })),
  clearEquipment: () => set({ selectedEquipment: [] }),

  toggleMuscle: (muscle) =>
    set((state) => ({
      selectedMuscles: state.selectedMuscles.includes(muscle)
        ? state.selectedMuscles.filter((m) => m !== muscle)
        : [...state.selectedMuscles, muscle],
    })),
  clearMuscles: () => set({ selectedMuscles: [] }),

  fetchExercises: async () => {
    set({ isLoadingExercises: true, exercisesError: null });
    try {
      const { selectedEquipment, selectedMuscles } = get();
      const result = await getExercisesAction({
        equipment: selectedEquipment,
        muscles: selectedMuscles,
        limit: 3,
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      set({ exercisesByMuscle: result?.data || [], isLoadingExercises: false });
    } catch (error) {
      set({ exercisesError: error, isLoadingExercises: false });
    }
  },

  setExercisesOrder: (order) => set({ exercisesOrder: order }),

  deleteExercise: (exerciseId) =>
    set((state) => ({
      exercisesByMuscle: state.exercisesByMuscle
        .map((group) => {
          const filteredExercises = group.exercises.filter((ex: any) => ex.id !== exerciseId);

          if (filteredExercises.length === group.exercises.length) {
            return group;
          }

          return { ...group, exercises: filteredExercises };
        })
        .filter((group) => group.exercises.length > 0),
      exercisesOrder: state.exercisesOrder.filter((id) => id !== exerciseId),
    })),

  shuffleExercise: async (exerciseId, muscle) => {
    set({ isShuffling: true });
    try {
      const { selectedEquipment, exercisesByMuscle } = get();

      const allExerciseIds = exercisesByMuscle.flatMap((group) => group.exercises.map((ex: any) => ex.id));

      const result = await shuffleExerciseAction({
        muscle: muscle,
        equipment: selectedEquipment,
        excludeExerciseIds: allExerciseIds,
      });

      if (result?.serverError) {
        throw new Error(result.serverError);
      }

      if (result?.data?.exercise) {
        const newExercise = result.data.exercise;

        set((state) => ({
          exercisesByMuscle: state.exercisesByMuscle.map((group) => {
            if (group.muscle === muscle) {
              return {
                ...group,
                exercises: group.exercises.map((ex: any) => (ex.id === exerciseId ? { ...newExercise, order: ex.order } : ex)),
              };
            }
            return group;
          }),
          exercisesOrder: state.exercisesOrder.map((id) => (id === exerciseId ? newExercise.id : id)),
        }));
      }
    } catch (error) {
      console.error("Error shuffling exercise:", error);
      throw error;
    } finally {
      set({ isShuffling: false });
    }
  },

  pickExercise: async (exerciseId) => {
    try {
      const result = await pickExerciseAction({ exerciseId });

      if (result?.serverError) {
        throw new Error(result.serverError);
      }

      if (result?.data?.success) {
        // Pour l'instant, on affiche juste un message de succès
        // Plus tard, on pourra ajouter de la logique pour marquer visuellement l'exercice
        console.log("Exercise picked successfully:", exerciseId);

        // Optionnel: on pourrait ajouter une propriété "picked" aux exercices
        // ou maintenir une liste des exercices "picked"
      }
    } catch (error) {
      console.error("Error picking exercise:", error);
      throw error;
    }
  },

  loadFromSession: ({ equipment, muscles, exercisesByMuscle, exercisesOrder }) => {
    set({
      selectedEquipment: equipment,
      selectedMuscles: muscles,
      exercisesByMuscle,
      exercisesOrder,
      currentStep: 3,
      isLoadingExercises: false,
      exercisesError: null,
    });
  },
}));
