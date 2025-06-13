"use client";

import { useState, useEffect, useCallback } from "react";

import { workoutSessionLocal } from "@/shared/lib/workout-session/workout-session.local";
import { ExerciseWithAttributes } from "@/features/workout-builder/types";

import type { WorkoutSession, WorkoutSessionExercise, WorkoutSet } from "@/features/workout-session/types/workout-set";

interface WorkoutSessionProgress {
  exerciseId: string;
  sets: {
    reps: number;
    weight?: number;
    duration?: number; // pour les exercices chronométrés
  }[];
  completed: boolean;
}

export function useWorkoutSession(sessionId?: string) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [progress, setProgress] = useState<Record<string, WorkoutSessionProgress>>({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Charger la session depuis localStorage au démarrage ou quand sessionId change
  useEffect(() => {
    if (!sessionId) return;
    const found = workoutSessionLocal.getById(sessionId);
    if (found) {
      setSession(found);
      setElapsedTime(found.duration || 0);
      setIsTimerRunning(!!found.endedAt === false);
    } else {
      setSession(null);
      setElapsedTime(0);
      setIsTimerRunning(false);
    }
  }, [sessionId]);

  // Chronomètre automatique
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (isTimerRunning && session) {
  //     interval = setInterval(() => {
  //       setElapsedTime((prev) => {
  //         const newElapsedTime = prev + 1;
  //         if (session) {
  //           const updatedSession = { ...session, duration: newElapsedTime };
  //           setSession(updatedSession);
  //           localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
  //         }
  //         return newElapsedTime;
  //       });
  //     }, 1000);
  //   }
  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [isTimerRunning, session]);

  const startWorkout = useCallback((exercises: ExerciseWithAttributes[], equipment: any[], muscles: any[]) => {
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
    setSession(newSession);
    setElapsedTime(0);
    setIsTimerRunning(true);
  }, []);

  // Navigation entre exercices
  const currentExerciseIndex = session?.exercises.findIndex((ex, idx) => idx === (session as any)?.currentExerciseIndex) ?? 0;
  const currentExercise = session?.exercises[currentExerciseIndex];

  // Guard pour éviter les erreurs si sets est absent
  const safeCurrentExercise = currentExercise && Array.isArray(currentExercise.sets) ? currentExercise : { ...currentExercise, sets: [] };

  const goToNextExercise = useCallback(() => {
    if (!session) return;
    const idx = currentExerciseIndex;
    if (idx < session.exercises.length - 1) {
      const updatedSession = { ...session, currentExerciseIndex: idx + 1 };
      setSession(updatedSession);
      workoutSessionLocal.update(session.id, { currentExerciseIndex: idx + 1 });
    }
  }, [session, currentExerciseIndex]);

  const goToPrevExercise = useCallback(() => {
    if (!session) return;
    const idx = currentExerciseIndex;
    if (idx > 0) {
      const updatedSession = { ...session, currentExerciseIndex: idx - 1 };
      setSession(updatedSession);
      workoutSessionLocal.update(session.id, { currentExerciseIndex: idx - 1 });
    }
  }, [session, currentExerciseIndex]);

  // Ajout d'un set
  const addSet = useCallback(() => {
    if (!session || !currentExercise) return;
    const exIdx = currentExerciseIndex;
    const sets = currentExercise.sets;
    const newSet: WorkoutSet = {
      id: `${currentExercise.id}-set-${sets.length + 1}`,
      setIndex: sets.length,
      types: ["REPS"],
      valuesInt: [],
      valuesSec: [],
      units: [],
      completed: false,
    };
    const updatedExercises = session.exercises.map((ex, idx) => (idx === exIdx ? { ...ex, sets: [...ex.sets, newSet] } : ex));
    const updatedSession = { ...session, exercises: updatedExercises };
    setSession(updatedSession);
    workoutSessionLocal.update(session.id, { exercises: updatedExercises });
  }, [session, currentExercise, currentExerciseIndex]);

  // Mise à jour d'un set
  const updateSet = useCallback(
    (exerciseIndex: number, setIndex: number, data: Partial<WorkoutSet>) => {
      if (!session) return;
      const targetExercise = session.exercises[exerciseIndex];
      if (!targetExercise) return;
      const updatedSets = targetExercise.sets.map((set, idx) => (idx === setIndex ? { ...set, ...data } : set));
      const updatedExercises = session.exercises.map((ex, idx) => (idx === exerciseIndex ? { ...ex, sets: updatedSets } : ex));
      const updatedSession = { ...session, exercises: updatedExercises };
      setSession(updatedSession);
      workoutSessionLocal.update(session.id, { exercises: updatedExercises });
    },
    [session],
  );

  // Suppression d'un set
  const removeSet = useCallback(
    (exerciseIndex: number, setIndex: number) => {
      if (!session) return;
      const targetExercise = session.exercises[exerciseIndex];
      if (!targetExercise) return;
      const updatedSets = targetExercise.sets.filter((_, idx) => idx !== setIndex);
      const updatedExercises = session.exercises.map((ex, idx) => (idx === exerciseIndex ? { ...ex, sets: updatedSets } : ex));
      const updatedSession = { ...session, exercises: updatedExercises };
      setSession(updatedSession);
      workoutSessionLocal.update(session.id, { exercises: updatedExercises });
    },
    [session],
  );

  // Marquer un set comme terminé
  const finishSet = useCallback(
    (exerciseIndex: number, setIndex: number) => {
      updateSet(exerciseIndex, setIndex, { completed: true });
    },
    [updateSet],
  );

  // Mettre en pause/reprendre le chronomètre
  const toggleTimer = useCallback(() => {
    setIsTimerRunning((prev) => {
      const newIsRunning = !prev;
      if (session) {
        const updatedSession = { ...session, isActive: newIsRunning };
        setSession(updatedSession);
        workoutSessionLocal.update(session.id, { isActive: newIsRunning });
      }
      return newIsRunning;
    });
  }, [session]);

  // Reset du chronomètre
  const resetTimer = useCallback(() => {
    setElapsedTime(0);
    if (session) {
      const updatedSession = { ...session, duration: 0 };
      setSession(updatedSession);
      workoutSessionLocal.update(session.id, { duration: 0 });
    }
  }, [session]);

  // Quitter l'entraînement
  const quitWorkout = useCallback(() => {
    if (session) {
      workoutSessionLocal.remove(session.id);
    }
    setSession(null);
    setProgress({});
    setElapsedTime(0);
    setIsTimerRunning(false);
  }, [session]);

  const completeWorkout = useCallback(() => {
    if (session) {
      workoutSessionLocal.update(session.id, { status: "completed", endedAt: new Date().toISOString() });
      setSession({ ...session, status: "completed", endedAt: new Date().toISOString() });
    }
    setProgress({});
    setElapsedTime(0);
    setIsTimerRunning(false);
  }, [session]);

  // Mettre à jour le progrès d'un exercice
  const updateExerciseProgress = useCallback((exerciseId: string, progressData: Partial<WorkoutSessionProgress>) => {
    setProgress((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        exerciseId,
        sets: [],
        completed: false,
        ...progressData,
      },
    }));
  }, []);

  // Formater le temps écoulé en HH:MM:SS
  const formatElapsedTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const goToExercise = useCallback(
    (targetIndex: number) => {
      if (!session) return;
      if (targetIndex >= 0 && targetIndex < session.exercises.length) {
        const updatedSession = { ...session, currentExerciseIndex: targetIndex };
        setSession(updatedSession);
        workoutSessionLocal.update(session.id, { currentExerciseIndex: targetIndex });
      }
    },
    [session],
  );

  return {
    // État
    session,
    progress,
    elapsedTime,
    isTimerRunning,
    isWorkoutActive: !!session,
    currentExercise: safeCurrentExercise,
    currentExerciseIndex,

    // Actions
    startWorkout,
    quitWorkout,
    completeWorkout,
    toggleTimer,
    resetTimer,
    updateExerciseProgress,
    addSet,
    updateSet,
    removeSet,
    finishSet,
    goToNextExercise,
    goToPrevExercise,
    goToExercise,

    // Utils
    formatElapsedTime: () => formatElapsedTime(elapsedTime),
  };
}
