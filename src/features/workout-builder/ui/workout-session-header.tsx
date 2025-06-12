"use client";

import { useState } from "react";
import { Clock, Play, Pause, RotateCcw, X, Dumbbell, Target } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";

import { QuitWorkoutDialog } from "./quit-workout-dialog";

interface WorkoutSessionHeaderProps {
  elapsedTime: string;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onQuitWorkout: () => void;
  onSaveAndQuit?: () => void;
  currentExerciseIndex: number;
  totalExercises: number;
  exerciseName?: string;
}

export function WorkoutSessionHeader({
  elapsedTime,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onQuitWorkout,
  onSaveAndQuit,
  currentExerciseIndex,
  totalExercises,
  exerciseName,
}: WorkoutSessionHeaderProps) {
  const t = useI18n();
  const [showQuitDialog, setShowQuitDialog] = useState(false);

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
        {/* Gaming-style header avec fond dégradé */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700/50">
          {/* Top row - Status et Quit button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                {t("workout_builder.session.workout_in_progress")}
              </span>
            </div>

            <Button
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
              onClick={handleQuitClick}
              size="small"
              variant="outline"
            >
              <X className="h-4 w-4 mr-2" />
              {t("workout_builder.session.quit_workout")}
            </Button>
          </div>

          {/* Main content - Cards style Chess.com */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Temps écoulé */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{t("workout_builder.session.elapsed_time")}</h3>
                </div>
              </div>

              {/* Chrono display - Large et centré */}
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-white mb-4 tracking-wider">{elapsedTime}</div>

                {/* Timer controls */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    className={cn(
                      "w-10 h-10 rounded-full p-0",
                      isTimerRunning ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white",
                    )}
                    onClick={onToggleTimer}
                    size="small"
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    className="w-10 h-10 rounded-full p-0 border-slate-600 text-slate-400 hover:bg-slate-700"
                    onClick={onResetTimer}
                    size="small"
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 2: Progression */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{t("workout_builder.session.exercise_progress")}</h3>
                </div>
              </div>

              <div className="space-y-4">
                {/* Progress display */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">{currentExerciseIndex + 1}</span>
                  <span className="text-slate-400">/ {totalExercises}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                    style={{ width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%` }}
                  />
                </div>

                {/* Percentage */}
                <div className="text-center">
                  <span className="text-sm text-slate-400">
                    {Math.round(((currentExerciseIndex + 1) / totalExercises) * 100)}% {t("workout_builder.session.complete")}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Exercice actuel */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{t("workout_builder.session.current_exercise")}</h3>
                </div>
              </div>

              <div className="space-y-3">
                {exerciseName ? (
                  <>
                    <h4 className="text-white font-medium text-lg leading-tight line-clamp-2">{exerciseName}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="text-emerald-400 text-sm">{t("workout_builder.session.active")}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 text-center py-4">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t("workout_builder.session.no_exercise_selected")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de confirmation pour quitter */}
      <QuitWorkoutDialog
        elapsedTime={elapsedTime}
        exercisesCompleted={currentExerciseIndex}
        isOpen={showQuitDialog}
        onClose={() => setShowQuitDialog(false)}
        onQuitWithoutSave={handleQuitWithoutSave}
        onQuitWithSave={handleQuitWithSave}
        totalExercises={totalExercises}
      />
    </>
  );
}
