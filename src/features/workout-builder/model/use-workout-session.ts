"use client";

import { useState, useEffect, useCallback } from "react";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import type { ExerciseWithAttributes } from "../types";

interface WorkoutSession {
  id: string;
  startTime: number;
  exercises: ExerciseWithAttributes[];
  equipment: ExerciseAttributeValueEnum[];
  muscles: ExerciseAttributeValueEnum[];
  currentExerciseIndex: number;
  isActive: boolean;
  elapsedTime: number; // en secondes
}

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
        setElapsedTime(parsedSession.elapsedTime || 0);
        setIsTimerRunning(parsedSession.isActive);
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
          // Mettre à jour le localStorage avec le nouveau temps
          if (session) {
            const updatedSession = { ...session, elapsedTime: newElapsedTime };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
          }
          return newElapsedTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, session]);

  // Démarrer une nouvelle session d'entraînement
  const startWorkout = useCallback(
    (exercises: ExerciseWithAttributes[], equipment: ExerciseAttributeValueEnum[], muscles: ExerciseAttributeValueEnum[]) => {
      const newSession: WorkoutSession = {
        id: Date.now().toString(),
        startTime: Date.now(),
        exercises,
        equipment,
        muscles,
        currentExerciseIndex: 0,
        isActive: true,
        elapsedTime: 0,
      };

      setSession(newSession);
      setElapsedTime(0);
      setIsTimerRunning(true);
      setProgress({});

      // Sauvegarder dans localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    },
    [],
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
      const updatedSession = { ...session, elapsedTime: 0 };
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

  // Passer à l'exercice suivant
  const goToNextExercise = useCallback(() => {
    if (session && session.currentExerciseIndex < session.exercises.length - 1) {
      const updatedSession = {
        ...session,
        currentExerciseIndex: session.currentExerciseIndex + 1,
      };
      setSession(updatedSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    }
  }, [session]);

  // Aller à l'exercice précédent
  const goToPreviousExercise = useCallback(() => {
    if (session && session.currentExerciseIndex > 0) {
      const updatedSession = {
        ...session,
        currentExerciseIndex: session.currentExerciseIndex - 1,
      };
      setSession(updatedSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    }
  }, [session]);

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
    currentExercise: session?.exercises[session.currentExerciseIndex],

    // Actions
    startWorkout,
    quitWorkout,
    completeWorkout,
    toggleTimer,
    resetTimer,
    updateExerciseProgress,
    goToNextExercise,
    goToPreviousExercise,

    // Utilitaires
    formatElapsedTime: () => formatElapsedTime(elapsedTime),
  };
}
