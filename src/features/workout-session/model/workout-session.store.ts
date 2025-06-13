import { create } from "zustand";

import { workoutSessionLocal } from "@/shared/lib/workout-session/workout-session.local";
import { WorkoutSession, WorkoutSessionExercise, WorkoutSet } from "@/features/workout-session/types/workout-set";

import { ExerciseWithAttributes } from "../../workout-builder/types";

interface WorkoutSessionProgress {
  exerciseId: string;
  sets: {
    reps: number;
    weight?: number;
    duration?: number;
  }[];
  completed: boolean;
}

interface WorkoutSessionState {
  session: WorkoutSession | null;
  progress: Record<string, WorkoutSessionProgress>;
  elapsedTime: number;
  isTimerRunning: boolean;
  isWorkoutActive: boolean;
  currentExerciseIndex: number;
  currentExercise: WorkoutSessionExercise | null;

  // Progression
  exercisesCompleted: number;
  totalExercises: number;
  progressPercent: number;

  // Actions
  startWorkout: (exercises: ExerciseWithAttributes[], equipment: any[], muscles: any[]) => void;
  quitWorkout: () => void;
  completeWorkout: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  updateExerciseProgress: (exerciseId: string, progressData: Partial<WorkoutSessionProgress>) => void;
  addSet: () => void;
  updateSet: (exerciseIndex: number, setIndex: number, data: Partial<WorkoutSet>) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  finishSet: (exerciseIndex: number, setIndex: number) => void;
  goToNextExercise: () => void;
  goToPrevExercise: () => void;
  goToExercise: (targetIndex: number) => void;
  formatElapsedTime: () => string;
}

export const useWorkoutSessionStore = create<WorkoutSessionState>((set, get) => ({
  session: null,
  progress: {},
  elapsedTime: 0,
  isTimerRunning: false,
  isWorkoutActive: false,
  currentExerciseIndex: 0,
  currentExercise: null,
  exercisesCompleted: 0,
  totalExercises: 0,
  progressPercent: 0,

  startWorkout: (exercises, _equipment, _muscles) => {
    const sessionExercises: WorkoutSessionExercise[] = exercises.map((ex, idx) => ({
      ...ex,
      order: idx,
      sets: [
        {
          id: `${ex.id}-set-1`,
          setIndex: 0,
          types: ["REPS", "WEIGHT"],
          valuesInt: [],
          valuesSec: [],
          units: [],
          completed: false,
        },
      ],
    }));
    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      userId: "local",
      startedAt: new Date().toISOString(),
      exercises: sessionExercises,
      status: "active",
    };
    workoutSessionLocal.add(newSession);
    workoutSessionLocal.setCurrent(newSession.id);
    set({
      session: newSession,
      elapsedTime: 0,
      isTimerRunning: true,
      isWorkoutActive: true,
      currentExerciseIndex: 0,
      currentExercise: sessionExercises[0],
    });
  },

  quitWorkout: () => {
    const { session } = get();
    if (session) {
      workoutSessionLocal.remove(session.id);
    }
    set({
      session: null,
      progress: {},
      elapsedTime: 0,
      isTimerRunning: false,
      isWorkoutActive: false,
      currentExerciseIndex: 0,
      currentExercise: null,
    });
  },

  completeWorkout: () => {
    const { session } = get();
    if (session) {
      workoutSessionLocal.update(session.id, { status: "completed", endedAt: new Date().toISOString() });
      set({
        session: { ...session, status: "completed", endedAt: new Date().toISOString() },
        progress: {},
        elapsedTime: 0,
        isTimerRunning: false,
        isWorkoutActive: false,
      });
    }
  },

  toggleTimer: () => {
    set((state) => {
      const newIsRunning = !state.isTimerRunning;
      if (state.session) {
        workoutSessionLocal.update(state.session.id, { isActive: newIsRunning });
      }
      return { isTimerRunning: newIsRunning };
    });
  },

  resetTimer: () => {
    set((state) => {
      if (state.session) {
        workoutSessionLocal.update(state.session.id, { duration: 0 });
      }
      return { elapsedTime: 0 };
    });
  },

  updateExerciseProgress: (exerciseId, progressData) => {
    set((state) => ({
      progress: {
        ...state.progress,
        [exerciseId]: {
          ...state.progress[exerciseId],
          exerciseId,
          sets: [],
          completed: false,
          ...progressData,
        },
      },
    }));
  },

  addSet: () => {
    const { session, currentExerciseIndex } = get();
    if (!session) return;
    const exIdx = currentExerciseIndex;
    const sets = session.exercises[exIdx].sets;
    const newSet: WorkoutSet = {
      id: `${session.exercises[exIdx].id}-set-${sets.length + 1}`,
      setIndex: sets.length,
      types: ["REPS"],
      valuesInt: [],
      valuesSec: [],
      units: [],
      completed: false,
    };
    const updatedExercises = session.exercises.map((ex, idx) => (idx === exIdx ? { ...ex, sets: [...ex.sets, newSet] } : ex));
    workoutSessionLocal.update(session.id, { exercises: updatedExercises });
    set({
      session: { ...session, exercises: updatedExercises },
      currentExercise: { ...updatedExercises[exIdx] },
    });
  },

  updateSet: (exerciseIndex, setIndex, data) => {
    const { session } = get();
    if (!session) return;
    const targetExercise = session.exercises[exerciseIndex];
    if (!targetExercise) return;
    const updatedSets = targetExercise.sets.map((set, idx) => (idx === setIndex ? { ...set, ...data } : set));
    const updatedExercises = session.exercises.map((ex, idx) => (idx === exerciseIndex ? { ...ex, sets: updatedSets } : ex));
    workoutSessionLocal.update(session.id, { exercises: updatedExercises });
    set({
      session: { ...session, exercises: updatedExercises },
      currentExercise: { ...updatedExercises[exerciseIndex] },
    });
  },

  removeSet: (exerciseIndex, setIndex) => {
    const { session } = get();
    if (!session) return;
    const targetExercise = session.exercises[exerciseIndex];
    if (!targetExercise) return;
    const updatedSets = targetExercise.sets.filter((_, idx) => idx !== setIndex);
    const updatedExercises = session.exercises.map((ex, idx) => (idx === exerciseIndex ? { ...ex, sets: updatedSets } : ex));
    workoutSessionLocal.update(session.id, { exercises: updatedExercises });
    set({
      session: { ...session, exercises: updatedExercises },
      currentExercise: { ...updatedExercises[exerciseIndex] },
    });
  },

  finishSet: (exerciseIndex, setIndex) => {
    get().updateSet(exerciseIndex, setIndex, { completed: true });
  },

  goToNextExercise: () => {
    const { session, currentExerciseIndex } = get();
    if (!session) return;
    const idx = currentExerciseIndex;
    if (idx < session.exercises.length - 1) {
      workoutSessionLocal.update(session.id, { currentExerciseIndex: idx + 1 });
      set({
        currentExerciseIndex: idx + 1,
        currentExercise: session.exercises[idx + 1],
      });
    }
  },

  goToPrevExercise: () => {
    const { session, currentExerciseIndex } = get();
    if (!session) return;
    const idx = currentExerciseIndex;
    if (idx > 0) {
      workoutSessionLocal.update(session.id, { currentExerciseIndex: idx - 1 });
      set({
        currentExerciseIndex: idx - 1,
        currentExercise: session.exercises[idx - 1],
      });
    }
  },

  goToExercise: (targetIndex) => {
    const { session } = get();
    if (!session) return;
    if (targetIndex >= 0 && targetIndex < session.exercises.length) {
      workoutSessionLocal.update(session.id, { currentExerciseIndex: targetIndex });
      set({
        currentExerciseIndex: targetIndex,
        currentExercise: session.exercises[targetIndex],
      });
    }
  },

  formatElapsedTime: () => {
    const { elapsedTime } = get();
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const secs = elapsedTime % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  },
}));
