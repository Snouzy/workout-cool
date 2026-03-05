import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Dumbbell,
  ChevronLeft,
} from "lucide-react";

import { Locale } from "locales/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ExerciseDetail as ExerciseDetailType } from "@/entities/exercise/actions/get-exercise-by-slug.action";

interface ExerciseDetailPageProps {
  exercise: ExerciseDetailType;
  locale: Locale;
}

const CATEGORY_LABELS: Record<string, string> = {
  push_horizontal: "Push Horizontal",
  push_vertical: "Push Vertical",
  pull_horizontal: "Pull Horizontal",
  pull_vertical: "Pull Vertical",
  core_anterior: "Core Anterior",
  core_posterior: "Core Posterior",
  core_stability: "Core Stability",
  legs: "Legs",
  skills: "Skills",
  mobility: "Mobility",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  elite: "Elite",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  elite: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Chest",
  anterior_deltoid: "Front Delts",
  triceps: "Triceps",
  latissimus_dorsi: "Lats",
  rhomboids: "Rhomboids",
  biceps: "Biceps",
  rectus_abdominis: "Abs",
  obliques: "Obliques",
  quadriceps: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  posterior_deltoid: "Rear Delts",
  trapezius: "Traps",
  forearms: "Forearms",
  calves: "Calves",
  hip_flexors: "Hip Flexors",
  erector_spinae: "Erectors",
  serratus_anterior: "Serratus",
  transverse_abdominis: "TVA",
  infraspinatus: "Infraspinatus",
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/,
  );
  return match?.[1] ?? null;
}

export function ExerciseDetailPage({ exercise, locale }: ExerciseDetailPageProps) {
  const displayName = exercise.nameEn ?? exercise.name;
  const videoId = exercise.videoUrl ? extractYouTubeId(exercise.videoUrl) : null;

  return (
    <main className="flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Back link */}
        <Link
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-[#4F8EF7] transition-colors mb-4"
          href={`/${locale}/exercises`}
        >
          <ChevronLeft className="w-4 h-4" />
          {/* TODO: i18n */}
          Back to exercises
        </Link>

        {/* Title and badges */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {displayName}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            size="small"
          >
            {CATEGORY_LABELS[exercise.category] ?? exercise.category}
          </Badge>
          <Badge
            className={`rounded-full ${DIFFICULTY_COLORS[exercise.difficultyLevel] ?? ""}`}
            size="small"
          >
            {DIFFICULTY_LABELS[exercise.difficultyLevel] ?? exercise.difficultyLevel}
          </Badge>
          {exercise.progressionContext && (
            <Badge
              className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              size="small"
            >
              {exercise.progressionContext.familyName} — Level {exercise.progressionContext.level}
            </Badge>
          )}
        </div>

        {/* Video */}
        {videoId && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={displayName}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {exercise.description && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {/* TODO: i18n */}
                    Description
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {exercise.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {exercise.instructions.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {/* TODO: i18n */}
                    Instructions
                  </h2>
                  <ol className="list-decimal list-inside space-y-2">
                    {exercise.instructions.map((instruction, i) => (
                      <li
                        className="text-gray-600 dark:text-gray-300 leading-relaxed"
                        key={i}
                      >
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Form Cues */}
            {exercise.cues.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {/* TODO: i18n */}
                    Form Cues
                  </h2>
                  <ul className="space-y-2">
                    {exercise.cues.map((cue, i) => (
                      <li
                        className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                        key={i}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Common Mistakes */}
            {exercise.commonMistakes.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {/* TODO: i18n */}
                    Common Mistakes
                  </h2>
                  <ul className="space-y-2">
                    {exercise.commonMistakes.map((mistake, i) => (
                      <li
                        className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                        key={i}
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Primary Muscles */}
            {exercise.primaryMuscles.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    {/* TODO: i18n */}
                    Primary Muscles
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.primaryMuscles.map((muscle) => (
                      <Badge
                        className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        key={muscle}
                        size="small"
                      >
                        {MUSCLE_LABELS[muscle] ?? muscle}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Secondary Muscles */}
            {exercise.secondaryMuscles.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    {/* TODO: i18n */}
                    Secondary Muscles
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.secondaryMuscles.map((muscle) => (
                      <Badge
                        className="rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        key={muscle}
                        size="small"
                      >
                        {MUSCLE_LABELS[muscle] ?? muscle}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Equipment */}
            {exercise.equipment.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    {/* TODO: i18n */}
                    Equipment Required
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.equipment.map((eq) => (
                      <Badge
                        className="rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        key={eq.id}
                        size="small"
                      >
                        <Dumbbell className="w-3 h-3" />
                        {eq.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Band info */}
            {(exercise.bandAssistance || exercise.bandResistance) && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    {/* TODO: i18n */}
                    Band Options
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {exercise.bandAssistance && <p>Band assistance available</p>}
                    {exercise.bandResistance && <p>Band resistance available</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Defaults */}
            <Card>
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {/* TODO: i18n */}
                  Defaults
                </h2>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p>Sets: {exercise.defaultSets}</p>
                  {exercise.defaultReps !== null && <p>Reps: {exercise.defaultReps}</p>}
                  {exercise.defaultHoldTime !== null && <p>Hold: {exercise.defaultHoldTime}s</p>}
                  <p>Rest: {exercise.restBetweenSets}s</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progression navigation */}
        {exercise.progressionContext && (
          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {/* TODO: i18n */}
                Progression: {exercise.progressionContext.familyName}
              </h2>
              <div className="flex items-center justify-between gap-4">
                {exercise.progressionContext.prevExercise ? (
                  <Link
                    className="flex items-center gap-2 text-sm text-[#4F8EF7] hover:underline"
                    href={`/${locale}/exercises/${exercise.progressionContext.prevExercise.slug}`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      Level {exercise.progressionContext.prevExercise.level}:{" "}
                      {exercise.progressionContext.prevExercise.nameEn ?? exercise.progressionContext.prevExercise.name}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {exercise.progressionContext.nextExercise ? (
                  <Link
                    className="flex items-center gap-2 text-sm text-[#4F8EF7] hover:underline"
                    href={`/${locale}/exercises/${exercise.progressionContext.nextExercise.slug}`}
                  >
                    <span>
                      Level {exercise.progressionContext.nextExercise.level}:{" "}
                      {exercise.progressionContext.nextExercise.nameEn ?? exercise.progressionContext.nextExercise.name}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
