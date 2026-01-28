import { create } from "zustand";

import { workoutSessionLocal } from "@/shared/lib/workout-session/workout-session.local";
import { WorkoutSession } from "@/shared/lib/workout-session/types/workout-session";
import { WorkoutSessionExercise, WorkoutSet } from "@/features/workout-session/types/workout-set";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

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
  startWorkout: (exercises: ExerciseWithAttributes[] | WorkoutSessionExercise[], equipment: any[], muscles: any[]) => void;
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
  getExercisesCompleted: () => number;
  getTotalExercises: () => number;
  getTotalReps: () => number;
  getTotalHoldTime: () => number;
  loadSessionFromLocal: () => void;
  addExerciseToSession: (exercise: ExerciseWithAttributes) => void;
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

  startWorkout: (exercises, _equipment, muscles) => {
    const sessionExercises: WorkoutSessionExercise[] = exercises.map((ex, idx) => {
      // Check if exercise already has sets (from program)
      if ("sets" in ex && ex.sets && ex.sets.length > 0) {
        return {
          ...ex,
          order: idx,
        } as WorkoutSessionExercise;
      }

      // Default sets for custom workouts (calisthenics-focused)
      return {
        ...ex,
        order: idx,
        sets: [
          {
            id: `${ex.id}-set-1`,
            setIndex: 0,
            reps: undefined,
            holdTimeSeconds: undefined,
            formQuality: undefined,
            bandUsed: "none",
            rpe: undefined,
            completed: false,
          },
        ],
      } as WorkoutSessionExercise;
    });

    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      userId: "local",
      startedAt: new Date().toISOString(),
      exercises: sessionExercises,
      status: "active",
      muscles,
    };

    workoutSessionLocal.add(newSession);
    workoutSessionLocal.setCurrent(newSession.id);

    set({
      session: newSession,
      elapsedTime: 0,
      isTimerRunning: false,
      isWorkoutActive: true,
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
      console.log({
        session: { ...session, status: "completed", endedAt: new Date().toISOString() },
        progress: {},
        elapsedTime: 0,
        isTimerRunning: false,
        isWorkoutActive: false,
      });
      set({
        session: { ...session, status: "completed", endedAt: new Date().toISOString() },
        progress: {},
        elapsedTime: 0,
        isTimerRunning: false,
        isWorkoutActive: false,
      });
    }

    // Workout builder removed - no step reset needed
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
    const currentExercise = session.exercises[exIdx];
    const sets = currentExercise.sets;

    // Copy band level from last set if exists
    let bandToCopy: "none" | "light" | "medium" | "heavy" | "extra_heavy" = "none";
    if (sets.length > 0) {
      const lastSet = sets[sets.length - 1];
      if (lastSet.bandUsed) {
        bandToCopy = lastSet.bandUsed;
      }
    }

    const newSet: WorkoutSet = {
      id: `${currentExercise.id}-set-${sets.length + 1}`,
      setIndex: sets.length,
      reps: undefined,
      holdTimeSeconds: undefined,
      formQuality: undefined,
      bandUsed: bandToCopy,
      rpe: undefined,
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

    // handle exercisesCompleted
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

    // if has completed all sets, go to next exercise
    const { session } = get();
    if (!session) return;

    const exercise = session.exercises[exerciseIndex];
    if (!exercise) return;

    if (exercise.sets.every((set) => set.completed)) {
      // get().goToNextExercise();
      // update exercisesCompleted
      const exercisesCompleted = get().exercisesCompleted;
      set({ exercisesCompleted: exercisesCompleted + 1 });
    }
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

  getExercisesCompleted: () => {
    const { session } = get();
    if (!session) return 0;

    // only count exercises with at least one set
    return session.exercises
      .filter((exercise) => exercise.sets.length > 0)
      .filter((exercise) => exercise.sets.every((set) => set.completed)).length;
  },

  getTotalExercises: () => {
    const { session } = get();
    if (!session) return 0;
    return session.exercises.length;
  },

  getTotalReps: () => {
    const { session } = get();
    if (!session) return 0;

    let totalReps = 0;

    session.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.completed && set.reps) {
          totalReps += set.reps;
        }
      });
    });

    return totalReps;
  },

  getTotalHoldTime: () => {
    const { session } = get();
    if (!session) return 0;

    let totalHoldTime = 0;

    session.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.completed && set.holdTimeSeconds) {
          totalHoldTime += set.holdTimeSeconds;
        }
      });
    });

    return totalHoldTime;
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

  loadSessionFromLocal: () => {
    const currentId = workoutSessionLocal.getCurrent();
    if (currentId) {
      const session = workoutSessionLocal.getById(currentId);
      if (session && session.status === "active") {
        set({
          session,
          isWorkoutActive: true,
          currentExerciseIndex: session.currentExerciseIndex ?? 0,
          currentExercise: session.exercises[session.currentExerciseIndex ?? 0],
          elapsedTime: 0,
          isTimerRunning: false,
        });
      }
    }
  },

  addExerciseToSession: (exercise) => {
    const { session } = get();

    if (!session) {
      return;
    }

    // Create new exercise with default sets (calisthenics-focused)
    const newExercise: WorkoutSessionExercise = {
      ...exercise,
      order: session.exercises.length,
      sets: [
        {
          id: `${exercise.id}-set-1`,
          setIndex: 0,
          reps: undefined,
          holdTimeSeconds: undefined,
          formQuality: undefined,
          bandUsed: "none",
          rpe: undefined,
          completed: false,
        },
      ],
    };

    // Check if exercise already exists to avoid duplicates
    const exerciseExists = session.exercises.some((ex) => ex.id === exercise.id);
    if (exerciseExists) {
      console.log("🟡 [WORKOUT-SESSION] Exercise already exists in session, skipping add");
      return;
    }

    const updatedExercises = [...session.exercises, newExercise];
    const updatedSession = { ...session, exercises: updatedExercises };

    // Update local storage
    workoutSessionLocal.update(session.id, { exercises: updatedExercises });

    // Update state
    set({ session: updatedSession });

    console.log("🟡 [WORKOUT-SESSION] Exercise added successfully to session");
  },
}));
