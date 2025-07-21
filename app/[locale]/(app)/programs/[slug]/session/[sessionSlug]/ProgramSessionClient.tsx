"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { ExerciseAttributeNameEnum, ProgramWeek } from "@prisma/client";

import { useCurrentLocale, useI18n } from "locales/client";
import { canStartSession } from "@/shared/lib/access-control";
import { WorkoutSessionSets } from "@/features/workout-session/ui/workout-session-sets";
import { WorkoutSessionHeader } from "@/features/workout-session/ui/workout-session-header";
import { useWorkoutSession } from "@/features/workout-session/model/use-workout-session";
import { SessionAccessGuard } from "@/features/programs/ui/session-access-guard";
import { getSessionDescription, getSessionTitle, getSessionSlug, getProgramTitle } from "@/features/programs/lib/translations-mapper";
import { startProgramSession } from "@/features/programs/actions/start-program-session.action";
import { enrollInProgram } from "@/features/programs/actions/enroll-program.action";
import { completeProgramSession } from "@/features/programs/actions/complete-program-session.action";
import { ProgramSessionWithExercises } from "@/entities/program-session/types/program-session.types";
import { ProgramI18nReference } from "@/entities/program/types/program.types";
import { Button } from "@/components/ui/button";
import { SessionRichSnippets } from "@/components/seo/session-rich-snippets";

interface ProgramSessionClientProps {
  program: ProgramI18nReference;
  week: ProgramWeek;
  session: ProgramSessionWithExercises;
  isAuthenticated: boolean;
  isPremium: boolean;
}

export function ProgramSessionClient({ program, week, session, isAuthenticated, isPremium }: ProgramSessionClientProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const router = useRouter();
  const { startWorkout, session: workoutSession, completeWorkout, isWorkoutActive, quitWorkout } = useWorkoutSession();
  const [isLoading, setIsLoading] = useState(false);
  const [_enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [sessionProgressId, setSessionProgressId] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [hasStartedWorkout, setHasStartedWorkout] = useState(false);

  const programTitle = getProgramTitle(program, locale);
  const programSessionTitle = getSessionTitle(session, locale);
  const programSessionDescription = getSessionDescription(session, locale);
  const programSlug = getSessionSlug(program, locale);
  const sessionSlug = getSessionSlug(session, locale);

  // Access control context
  const accessContext = {
    isAuthenticated,
    isPremium,
    isSessionPremium: session.isPremium,
  };

  const handleStartWorkout = async () => {
    if (!canStartSession(accessContext)) return;

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
        id: ex.exercise.id,
        name: ex.exercise.name,
        nameEn: ex.exercise.nameEn || null,
        description: ex.exercise.description || "",
        descriptionEn: ex.exercise.descriptionEn || "",
        fullVideoUrl: ex.exercise.fullVideoUrl || null,
        fullVideoImageUrl: ex.exercise.fullVideoImageUrl || null,
        introduction: null,
        introductionEn: null,
        slug: null,
        slugEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: ex.order,
        attributes: ex.exercise.attributes.map((attr) => ({
          id: attr.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          exerciseId: ex.exercise.id,
          attributeNameId: attr.attributeNameId,
          attributeValueId: attr.attributeValueId,
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue,
        })),
      }));

      // Extract equipment and muscles from session exercises
      const equipment = session.exercises.flatMap((ex) =>
        ex.exercise.attributes
          .filter((attr) => attr.attributeName === ExerciseAttributeNameEnum.EQUIPMENT)
          .map((attr) => attr.attributeValue),
      );

      const muscles = session.exercises.flatMap((ex) =>
        ex.exercise.attributes
          .filter((attr) => attr.attributeName === ExerciseAttributeNameEnum.PRIMARY_MUSCLE)
          .map((attr) => attr.attributeValue),
      );

      // Convert suggestedSets to workout format
      const exercisesWithSets = exercises.map((exercise, idx) => {
        const programExercise = session.exercises[idx];
        const suggestedSets = programExercise?.suggestedSets || [];

        const workoutSets = suggestedSets.map((suggestedSet, setIndex) => ({
          id: `${exercise.id}-set-${setIndex + 1}`,
          setIndex,
          types: suggestedSet.types || [],
          valuesInt: suggestedSet.valuesInt || [],
          valuesSec: suggestedSet.valuesSec || [],
          units: suggestedSet.units || [],
          completed: false,
        }));

        return {
          ...exercise,
          sets:
            workoutSets.length > 0
              ? workoutSets
              : [
                  {
                    id: `${exercise.id}-set-1`,
                    setIndex: 0,
                    types: ["REPS"],
                    valuesInt: [],
                    valuesSec: [],
                    units: [],
                    completed: false,
                  },
                ],
        };
      });

      startWorkout(exercisesWithSets, equipment, muscles);
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

  const totalSets = session.exercises.reduce((total, ex) => total + ex.suggestedSets.length, 0);

  // Use access guard to handle authentication and premium restrictions
  return (
    <SessionAccessGuard
      context={accessContext}
      programSlug={programSlug}
      sessionDescription={programSessionDescription}
      sessionSlug={sessionSlug}
      sessionTitle={programSessionTitle}
    >
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
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-2 md:p-6">
          <div className="max-w-4xl mx-auto">
            <article className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-6 mb-6">
              {/* Session info */}
              <header className="flex items-center justify-between mb-6 flex-col text-center">
                <div className="mt-5 sm:mt-0 flex flex-col gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{programSessionTitle}</h1>
                  <SessionRichSnippets
                    duration={Math.round(session.exercises.length * 3)}
                    exerciseCount={session.exercises.length}
                    totalSets={totalSets}
                  />
                </div>
                {programSessionDescription && <p className="text-gray-600 dark:text-gray-400 mt-2">{programSessionDescription}</p>}
              </header>

              {/* Exercise list */}
              <section className="space-y-4 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("programs.exercises_in_session")}</h2>
                <div className="grid gap-3">
                  {session.exercises.map((exercise, index) => {
                    const exerciseName = locale === "fr" ? exercise.exercise.name : exercise.exercise.nameEn;
                    return (
                      <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" key={exercise.id}>
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{exerciseName}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {exercise.suggestedSets.length} {t("programs.set", { count: exercise.suggestedSets.length })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Start workout button */}
              <footer className="flex justify-center">
                <Button
                  className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] hover:from-[#4F8EF7]/80 hover:to-[#25CB78]/80 text-white px-8 py-4 text-lg font-bold rounded-xl flex items-center gap-3"
                  disabled={isLoading}
                  onClick={handleStartWorkout}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t("programs.starting_session")}
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      {t("programs.start_session")}
                    </>
                  )}
                </Button>
              </footer>
            </article>
          </div>
        </main>
      </div>
    </SessionAccessGuard>
  );
}
