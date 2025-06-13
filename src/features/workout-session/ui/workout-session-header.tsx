"use client";

import { useState } from "react";
import { Clock, Play, Pause, RotateCcw, X, Target } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { useWorkoutSession } from "@/features/workout-session/model/use-workout-session";
import { Button } from "@/components/ui/button";

import { QuitWorkoutDialog } from "../../workout-builder/ui/quit-workout-dialog";

interface WorkoutSessionHeaderProps {
  elapsedTime: string;
  isTimerRunning: boolean;
  onToggleTimer: VoidFunction;
  onResetTimer: VoidFunction;
  onQuitWorkout: VoidFunction;
  onSaveAndQuit?: VoidFunction;
  currentExerciseIndex: number;
}

export function WorkoutSessionHeader({
  elapsedTime,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onQuitWorkout,
  onSaveAndQuit,
  currentExerciseIndex,
}: WorkoutSessionHeaderProps) {
  const t = useI18n();
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const { getExercisesCompleted, getTotalExercises } = useWorkoutSession();
  const exercisesCompleted = getExercisesCompleted();
  const totalExercises = getTotalExercises();

  const handleQuitClick = () => {
    setShowQuitDialog(true);
  };

  const handleQuitWithSave = () => {
    onSaveAndQuit?.();
    setShowQuitDialog(false);
  };

  const handleQuitWithoutSave = () => {
    onQuitWorkout();
    setShowQuitDialog(false);
  };

  return (
    <>
      <div className="w-full mb-8">
        {/* Minimal header, fond blanc en clair, dégradé en dark */}
        <div className="rounded-xl p-3 bg-slate-50">
          {/* Top row - Status et Quit button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                {t("workout_builder.session.workout_in_progress")}
              </span>
            </div>

            <Button
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 px-2 py-1 text-xs"
              onClick={handleQuitClick}
              variant="outline"
            >
              <X className="h-3 w-3 mr-1" />
              {t("workout_builder.session.quit_workout")}
            </Button>
          </div>

          {/* Main content - Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Card 1: Temps écoulé */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-700/80 rounded-lg p-3 border border-slate-100 dark:border-slate-600/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-slate-700 dark:text-white font-semibold text-base">{t("workout_builder.session.elapsed_time")}</h3>
                </div>
              </div>

              {/* Chrono display - Large et centré */}
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mb-2 tracking-wider">{elapsedTime}</div>

                {/* Timer controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    className={cn(
                      "w-8 h-8 rounded-full p-0 text-white",
                      isTimerRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600",
                    )}
                    onClick={onToggleTimer}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    className="w-8 h-8 rounded-full p-0 border-slate-200 text-slate-400 hover:bg-slate-100 dark:border-slate-600 hover:dark:bg-slate-700"
                    onClick={onResetTimer}
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 2: Progression */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-700/80 rounded-lg p-3 border border-slate-100 dark:border-slate-600/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-slate-700 dark:text-white font-semibold text-base">
                    {t("workout_builder.session.exercise_progress")}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                {/* Progress display */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{exercisesCompleted}</span>
                  <span className="text-slate-400">/ {totalExercises}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                    style={{ width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%` }}
                  />
                </div>

                {/* Percentage */}
                <div className="text-center">
                  <span className="text-xs text-slate-400">
                    {Math.round((exercisesCompleted / totalExercises) * 100)}% {t("workout_builder.session.complete")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de confirmation pour quitter */}
      <QuitWorkoutDialog
        elapsedTime={elapsedTime}
        exercisesCompleted={exercisesCompleted}
        isOpen={showQuitDialog}
        onClose={() => setShowQuitDialog(false)}
        onQuitWithoutSave={handleQuitWithoutSave}
        onQuitWithSave={handleQuitWithSave}
        totalExercises={totalExercises}
      />
    </>
  );
}
