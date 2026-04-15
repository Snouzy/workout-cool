import { create } from "zustand";
import { ExerciseAttributeValueEnum, WorkoutSessionExercise } from "@prisma/client";

import { WorkoutBuilderStep } from "../types";
import { shuffleExerciseAction } from "../actions/shuffle-exercise.action";
import { pickExerciseAction } from "../actions/pick-exercise.action";
import { getExercisesAction } from "../actions/get-exercises.action";

interface WorkoutBuilderState {
  currentStep: WorkoutBuilderStep;
  selectedEquipment: ExerciseAttributeValueEnum[];
  selectedMuscles: ExerciseAttributeValueEnum[];

  exercisesByMuscle: any[]; //TODO: type this
  isLoadingExercises: boolean;
  exercisesError: any; //TODO: type this
  exercisesOrder: string[];
  shufflingExerciseId: string | null;

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
  setExercisesByMuscle: (exercisesByMuscle: any[]) => void;
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

// Helper function to update URL without navigation
const updateURL = (step: WorkoutBuilderStep) => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step.toString());
    window.history.pushState({ step }, "", url.toString());
  }
};

// Helper function to get step from URL
const getStepFromURL = (): WorkoutBuilderStep => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const step = parseInt(params.get("step") || "1", 10);
    return Math.max(1, Math.min(3, step)) as WorkoutBuilderStep;
  }
  return 1;
};

export const useWorkoutBuilderStore = create<WorkoutBuilderState>((set, get) => {
  // Initialize from URL if available
  const initialStep = getStepFromURL();

  // Listen for browser back/forward buttons
  if (typeof window !== "undefined") {
    window.addEventListener("popstate", (event) => {
      const step = event.state?.step || getStepFromURL();
      set({ currentStep: step });
    });
  }

  return {
    currentStep: initialStep,
    selectedEquipment: [],
    selectedMuscles: [],
    exercisesByMuscle: [],
    isLoadingExercises: false,
    exercisesError: null,
    exercisesOrder: [],
    shufflingExerciseId: null,

    setStep: (step) => {
      set({ currentStep: step });
      updateURL(step);
    },

    nextStep: () => {
      const newStep = Math.min(get().currentStep + 1, 3) as WorkoutBuilderStep;
      set({ currentStep: newStep });
      updateURL(newStep);
    },

    prevStep: () => {
      const newStep = Math.max(get().currentStep - 1, 1) as WorkoutBuilderStep;
      set({ currentStep: newStep });
      updateURL(newStep);
    },

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

    setExercisesByMuscle: (exercisesByMuscle) => set({ exercisesByMuscle }),

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
      set({ shufflingExerciseId: exerciseId });
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
        set({ shufflingExerciseId: null });
      }
    },

    pickExercise: async (exerciseId) => {
      try {
        const result = await pickExerciseAction({ exerciseId });

        if (result?.serverError) {
          throw new Error(result.serverError);
        }

        if (result?.data?.success) {
          console.log("Exercise picked successfully:", exerciseId);
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
      updateURL(3);
    },
  };
});