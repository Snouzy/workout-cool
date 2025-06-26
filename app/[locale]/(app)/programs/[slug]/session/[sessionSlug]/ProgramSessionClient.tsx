"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Exercise, ExerciseAttribute, ExerciseAttributeName, ExerciseAttributeValue } from "@prisma/client";

import { WorkoutSessionTimer } from "@/features/workout-session/ui/workout-session-timer";
import { WorkoutSessionSets } from "@/features/workout-session/ui/workout-session-sets";
import { useWorkoutSession } from "@/features/workout-session/model/use-workout-session";
type ProgramExerciseWithAttributes = Exercise & {
  attributes: (ExerciseAttribute & {
    attributeName: ExerciseAttributeName;
    attributeValue: ExerciseAttributeValue;
  })[];
};
import { startProgramSession } from "@/features/programs/actions/start-program-session.action";
import { enrollInProgram } from "@/features/programs/actions/enroll-program.action";
import { completeProgramSession } from "@/features/programs/actions/complete-program-session.action";
import { Button } from "@/components/ui/button";

interface ProgramSessionClientProps {
  program: {
    id: string;
    title: string;
    slug: string;
  };
  week: {
    id: string;
    weekNumber: number;
    title: string | null;
  };
  session: {
    id: string;
    sessionNumber: number;
    title: string;
    description: string | null;
    exercises: Array<{
      id: string;
      order: number;
      suggestedSets: Array<{
        id: string;
        setIndex: number;
        types: string[];
        valuesInt: number[];
        valuesSec: number[];
        units: string[];
      }>;
      exercise: ProgramExerciseWithAttributes;
    }>;
  };
}

export function ProgramSessionClient({ program, week, session }: ProgramSessionClientProps) {
  const router = useRouter();
  const { startWorkout, session: workoutSession, completeWorkout } = useWorkoutSession();
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [sessionProgressId, setSessionProgressId] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // Ensure user is enrolled
      const { enrollment } = await enrollInProgram(program.id);
      setEnrollmentId(enrollment.id);

      // Start or resume session
      const { sessionProgress } = await startProgramSession(enrollment.id, session.id);
      setSessionProgressId(sessionProgress.id);

      // If session not completed, start workout session
      if (!sessionProgress.completedAt) {
        const exercises = session.exercises.map((ex) => ({
          ...ex.exercise,
          order: ex.order, // Ajouter l'order depuis ProgramSessionExercise
        }));

        startWorkout(exercises, [], []);
        setIsWorkoutActive(true);
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
      router.push(`/programs/${program.slug}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!workoutSession || !sessionProgressId) return;

    try {
      // Complete the workout
      completeWorkout();

      // Save to database and mark session as complete
      const { isCompleted, nextWeek, nextSession } = await completeProgramSession(sessionProgressId, workoutSession.id);

      setShowCongrats(true);
      setIsWorkoutActive(false);

      // Navigate after delay
      setTimeout(() => {
        if (isCompleted) {
          router.push(`/programs/${program.slug}?completed=true`);
        } else {
          router.push(`/programs/${program.slug}?week=${nextWeek}&session=${nextSession}`);
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to complete session:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la séance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] text-white p-4">
        <div className="flex items-center gap-4 mb-2">
          <Button
            className="text-white hover:bg-white/20"
            onClick={() => router.push(`/programs/${program.slug}`)}
            size="icon"
            variant="ghost"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <p className="text-sm opacity-90">
              {program.title} - Semaine {week.weekNumber}
            </p>
            <h1 className="text-xl font-bold">{session.title}</h1>
          </div>
        </div>
        {isWorkoutActive && <WorkoutSessionTimer />}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <WorkoutSessionSets isWorkoutActive={isWorkoutActive} onCongrats={handleCompleteSession} showCongrats={showCongrats} />
      </div>
    </div>
  );
}
