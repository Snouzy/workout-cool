"use client";

import { useState, useEffect, useCallback } from "react";

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

const STORAGE_KEY = "workout-session";

export function useWorkoutSession() {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [progress, setProgress] = useState<Record<string, WorkoutSessionProgress>>({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Charger la session depuis localStorage au démarrage
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const parsedSession: WorkoutSession = JSON.parse(savedSession);
        setSession(parsedSession);
        setElapsedTime(parsedSession.duration || 0);
        setIsTimerRunning(!!parsedSession.endedAt === false);
      } catch (error) {
        console.error("Error loading workout session:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Chronomètre automatique
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && session) {
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          const newElapsedTime = prev + 1;
          if (session) {
            const updatedSession = { ...session, duration: newElapsedTime };
            setSession(updatedSession);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
          }
          return newElapsedTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, session]);

  const startWorkout = useCallback((exercises: any[], equipment: any[], muscles: any[]) => {
    // On crée la structure WorkoutSession avec les sets vides, même si l'exercice d'origine a déjà un champ sets, on l'écrase
    const sessionExercises: WorkoutSessionExercise[] = exercises.map((ex, idx) => ({
      id: ex.id,
      exerciseId: ex.id,
      name: ex.name,
      nameEn: ex.nameEn,
      order: idx,
      sets: [
        {
          id: `${ex.id}-set-1`,
          setIndex: 0,
          type: "REPS",
          completed: false,
        },
      ],
    }));
    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      userId: "local", // à remplacer par l'id user réel si connecté
      startedAt: new Date().toISOString(),
      exercises: sessionExercises,
    };
    setSession(newSession);
    setElapsedTime(0);
    setIsTimerRunning(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    }
  }, [session, currentExerciseIndex]);

  const goToPrevExercise = useCallback(() => {
    if (!session) return;
    const idx = currentExerciseIndex;
    if (idx > 0) {
      const updatedSession = { ...session, currentExerciseIndex: idx - 1 };
      setSession(updatedSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
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
      type: "REPS",
      completed: false,
    };
    const updatedExercises = session.exercises.map((ex, idx) => (idx === exIdx ? { ...ex, sets: [...ex.sets, newSet] } : ex));
    const updatedSession = { ...session, exercises: updatedExercises };
    setSession(updatedSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    }
  }, [session]);

  // Quitter l'entraînement
  const quitWorkout = useCallback(() => {
    setSession(null);
    setProgress({});
    setElapsedTime(0);
    setIsTimerRunning(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Terminer l'entraînement
  const completeWorkout = useCallback(() => {
    if (session) {
      // Ici on pourrait sauvegarder l'entraînement terminé dans une base de données
      // Pour l'instant, on retire juste de localStorage
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
      setProgress({});
      setElapsedTime(0);
      setIsTimerRunning(false);
    }
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

    // Utils
    formatElapsedTime: () => formatElapsedTime(elapsedTime),
  };
}
