"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Clock, Dumbbell, Lock } from "lucide-react";
import { Exercise, ExerciseAttribute, ExerciseAttributeName, ExerciseAttributeValue, ProgramSession } from "@prisma/client";

import { useCurrentLocale, useI18n } from "locales/client";
import { WorkoutSessionSets } from "@/features/workout-session/ui/workout-session-sets";
import { WorkoutSessionHeader } from "@/features/workout-session/ui/workout-session-header";
import { useWorkoutSession } from "@/features/workout-session/model/use-workout-session";
import {
  getDetailProgramSessionTitle,
  getSessionProgramTitle,
  getSessionProgramSlug,
  getDetailProgramSessionDescription,
} from "@/features/programs/lib/translations-mapper";
import { startProgramSession } from "@/features/programs/actions/start-program-session.action";
import { enrollInProgram } from "@/features/programs/actions/enroll-program.action";
import { completeProgramSession } from "@/features/programs/actions/complete-program-session.action";
import { Button } from "@/components/ui/button";

type ProgramExerciseWithAttributes = Exercise & {
  attributes: (ExerciseAttribute & {
    attributeName: ExerciseAttributeName;
    attributeValue: ExerciseAttributeValue;
  })[];
};

export type ProgramSessionDetail = ProgramSession & {
  exercises: (ProgramExerciseWithAttributes & {
    suggestedSets: {
      id: string;
      setIndex: number;
      types: string[];
      valuesInt: number[];
      valuesSec: number[];
      units: string[];
    }[];
    order: number;
    exercise: ProgramExerciseWithAttributes;
  })[];
};

interface ProgramSessionClientProps {
  program: {
    id: string;
    title: string;
    titleEn: string;
    titleEs: string;
    titlePt: string;
    titleRu: string;
    titleZhCn: string;
    slug: string;
    slugEn: string;
    slugEs: string;
    slugPt: string;
    slugRu: string;
    slugZhCn: string;
  };
  week: {
    id: string;
    weekNumber: number;
    title: string | null;
  };
  session: ProgramSessionDetail;
  isAuthenticated: boolean;
  canAccessContent: boolean;
  isPremiumSession: boolean;
}

export function ProgramSessionClient({
  program,
  week,
  session,
  isAuthenticated,
  canAccessContent,
  isPremiumSession,
}: ProgramSessionClientProps) {
  console.log("program:", program);

  const t = useI18n();
  const locale = useCurrentLocale();
  const router = useRouter();
  const { startWorkout, session: workoutSession, completeWorkout, isWorkoutActive, quitWorkout } = useWorkoutSession();
  console.log("workoutSession:", workoutSession);
  const [isLoading, setIsLoading] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [sessionProgressId, setSessionProgressId] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [hasStartedWorkout, setHasStartedWorkout] = useState(false);
  const programTitle = getSessionProgramTitle(locale, program);
  const programSessionTitle = getDetailProgramSessionTitle(locale, session);
  const programSessionDescription = getDetailProgramSessionDescription(locale, session);

  console.log("session:", session);
  const programSlug = getSessionProgramSlug(locale, program);
  const handleStartWorkout = async () => {
    if (!canAccessContent) return;

    setIsLoading(true);
    try {
      // Ensure user is enrolled
      const { enrollment } = await enrollInProgram(program.id);
      setEnrollmentId(enrollment.id);

      // Start or resume session
      const { sessionProgress } = await startProgramSession(enrollment.id, session.id);
      setSessionProgressId(sessionProgress.id);

      // Convert program exercises to workout format
      const exercises = session.exercises.map((ex) => ({
        ...ex.exercise,
        order: ex.order,
      }));

      // Extract equipment and muscles from session exercises
      const equipment = session.exercises.flatMap((ex) =>
        ex.exercise.attributes.filter((attr) => attr.attributeName.name === "EQUIPMENT").map((attr) => attr.attributeValue.value),
      );

      const muscles = session.exercises.flatMap((ex) =>
        ex.exercise.attributes.filter((attr) => attr.attributeName.name === "PRIMARY_MUSCLE").map((attr) => attr.attributeValue.value),
      );

      startWorkout(exercises, equipment, muscles);
      setHasStartedWorkout(true);
    } catch (error) {
      console.error("Failed to start session:", error);
      alert(t("programs.error_starting_session"));
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

      if (isCompleted) {
        router.push(`/programs/${programSlug}?completed=true&refresh=${Date.now()}`);
      } else {
        router.push(`/programs/${programSlug}?week=${nextWeek}&session=${nextSession}&refresh=${Date.now()}`);
      }
    } catch (error) {
      console.error("Failed to complete session:", error);
    }
  };

  const handleQuitWorkout = () => {
    quitWorkout();
    setHasStartedWorkout(false);
  };

  // Show workout interface if user has started the workout
  if (hasStartedWorkout && isWorkoutActive && workoutSession) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <WorkoutSessionHeader onQuitWorkout={handleQuitWorkout} />
        <WorkoutSessionSets isWorkoutActive={isWorkoutActive} onCongrats={handleCompleteSession} showCongrats={showCongrats} />
      </div>
    );
  }

  // Show preview/restricted content if user can't access full content
  if (!canAccessContent) {
    return (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] text-white p-4">
          <div className="flex items-center gap-4 mb-2">
            <Button
              className="text-white hover:bg-white/20"
              onClick={() => router.push(`/programs/${programSlug}`)}
              size="icon"
              variant="ghost"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1">
              <p className="text-sm opacity-90">
                {programTitle} - {t("programs.week")} {week.weekNumber}
              </p>
              <h1 className="text-xl font-bold">{programSessionTitle}</h1>
            </div>
          </div>
        </div>

        {/* Restricted content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("programs.premium_session")}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t("programs.premium_session_description")}</p>
              </div>

              {programSessionDescription && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t("programs.workout_description")}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{programSessionDescription}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t("programs.premium_session_exercises")}</h3>
                <div className="space-y-2">
                  {session.exercises.map((exercise, index) => (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg" key={exercise.id}>
                      <span className="font-medium text-gray-900 dark:text-white">{index + 1}. 👀</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {exercise.suggestedSets.length} {t("programs.set", { count: exercise.suggestedSets.length })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {!isAuthenticated && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/auth/login")}>
                    {t("programs.connect_to_access")}
                  </Button>
                )}
                {isAuthenticated && (
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => router.push("/premium")}>
                    {t("programs.become_premium")}
                  </Button>
                )}
                <Button className="w-full" onClick={() => router.push(`/programs/${program.slug}`)} variant="outline">
                  {t("programs.back_to_program")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show session preview/start screen
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] text-white p-4">
        <div className="flex items-center gap-4 mb-2">
          <Button
            className="text-white hover:bg-white/20"
            onClick={() => router.push(`/programs/${programSlug}`)}
            size="icon"
            variant="ghost"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <p className="text-sm opacity-90">
              {programTitle} - {t("programs.week")} {week.weekNumber}
            </p>
            <h1 className="text-xl font-bold">{programSessionTitle}</h1>
          </div>
        </div>
      </div>

      {/* Session preview content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            {/* Session info */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{programSessionTitle}</h2>
                {session.description && <p className="text-gray-600 dark:text-gray-400 mt-2">{session.description}</p>}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>~{Math.round(session.exercises.length * 3)} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell size={16} />
                  <span>{session.exercises.length} exercices</span>
                </div>
              </div>
            </div>

            {/* Exercise list */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exercices de la séance</h3>
              <div className="grid gap-3">
                {session.exercises.map((exercise, index) => (
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" key={exercise.id}>
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{exercise.exercise.name}</h4>
                      {exercise.exercise.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exercise.exercise.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{exercise.suggestedSets.length} série(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start workout button */}
            <div className="flex justify-center">
              <Button
                className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] hover:from-[#4F8EF7]/80 hover:to-[#25CB78]/80 text-white px-8 py-4 text-lg font-bold rounded-xl flex items-center gap-3"
                disabled={isLoading}
                onClick={handleStartWorkout}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Démarrage...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Démarrer la séance
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
