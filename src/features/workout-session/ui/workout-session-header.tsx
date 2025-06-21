"use client";

import { useState, useEffect } from "react";
import { X, Target, Weight } from "lucide-react";

import { useCurrentLocale, useI18n } from "locales/client";
import { type WeightUnit } from "@/shared/lib/weight-conversion";
import { cn } from "@/shared/lib/utils";
import { useWorkoutSession } from "@/features/workout-session/model/use-workout-session";
import { Button } from "@/components/ui/button";

import { QuitWorkoutDialog } from "../../workout-builder/ui/quit-workout-dialog";

interface WorkoutSessionHeaderProps {
  onQuitWorkout: VoidFunction;
}

export function WorkoutSessionHeader({ onQuitWorkout }: WorkoutSessionHeaderProps) {
  const t = useI18n();
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [volumeUnit, setVolumeUnit] = useState<WeightUnit>("kg");
  const locale = useCurrentLocale();
  const { getExercisesCompleted, getTotalExercises, session, getTotalVolumeInUnit } = useWorkoutSession();
  const exercisesCompleted = getExercisesCompleted();
  const totalExercises = getTotalExercises();
  const totalVolume = getTotalVolumeInUnit(volumeUnit);

  // Format time with animated colons
  const formatTimeWithAnimatedColons = (date: Date) => {
    const timeString = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    const parts = timeString.split(":");

    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <span className="animate-colon-blink">:</span>
          {parts[1]}
        </>
      );
    }
    return timeString;
  };

  // Load volume unit preference from localStorage
  useEffect(() => {
    const savedUnit = localStorage.getItem("volumeUnit") as WeightUnit;
    if (savedUnit === "kg" || savedUnit === "lbs") {
      setVolumeUnit(savedUnit);
    }
  }, []);

  // Save volume unit preference to localStorage
  const handleVolumeUnitChange = (unit: WeightUnit) => {
    setVolumeUnit(unit);
    localStorage.setItem("volumeUnit", unit);
  };

  const handleQuitClick = () => {
    setShowQuitDialog(true);
  };

  const handleQuitWithoutSave = () => {
    onQuitWorkout();
    setShowQuitDialog(false);
  };

  return (
    <>
      <div className="w-full mt-2 mb-6 px-2 sm:px-6">
        <div className="rounded-lg p-2 sm:p-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-emerald-400 font-medium text-xs tracking-wide">
              {t("workout_builder.session.started_at")} {formatTimeWithAnimatedColons(new Date(session?.startedAt || ""))}
            </span>

            <Button
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 px-2 py-1 text-xs dark:border-red-700/40 dark:text-red-300 dark:hover:bg-red-700/10"
              onClick={handleQuitClick}
              variant="outline"
            >
              <X className="h-3 w-3 mr-1" />
              {t("workout_builder.session.quit_workout")}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Card 1: Exercise Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-md p-2 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Target className="h-3 w-3 text-purple-400" />
                </div>
                <h3 className="text-slate-700 dark:text-white font-medium text-xs truncate">
                  {t("workout_builder.session.exercise_progress")}
                </h3>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{exercisesCompleted}</span>
                  <span className="text-slate-400 text-sm">/ {totalExercises}</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                    style={{ width: `${(exercisesCompleted / totalExercises) * 100}%` }}
                  />
                </div>

                <div className="text-center">
                  <span className="text-xs text-slate-400">
                    {Math.round((exercisesCompleted / totalExercises) * 100)}% {t("workout_builder.session.complete")}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Volume */}
            <div className="bg-white dark:bg-slate-800 rounded-md p-2 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Weight className="h-3 w-3 text-orange-400" />
                </div>
                <h3 className="text-slate-700 dark:text-white font-medium text-xs truncate">{t("workout_builder.session.total_volume")}</h3>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {totalVolume.toFixed(volumeUnit === "lbs" ? 1 : 0)}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded transition-colors",
                      volumeUnit === "kg"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                    )}
                    onClick={() => handleVolumeUnitChange("kg")}
                  >
                    kg
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <button
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded transition-colors",
                      volumeUnit === "lbs"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                    )}
                    onClick={() => handleVolumeUnitChange("lbs")}
                  >
                    lbs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuitWorkoutDialog
        exercisesCompleted={exercisesCompleted}
        isOpen={showQuitDialog}
        onClose={() => setShowQuitDialog(false)}
        onQuitWithoutSave={handleQuitWithoutSave}
        totalExercises={totalExercises}
      />
    </>
  );
}
