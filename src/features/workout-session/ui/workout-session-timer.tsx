"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { useWorkoutSession } from "@/features/workout-builder";
import { Timer } from "@/components/ui/timer";
import { Button } from "@/components/ui/button";

export function WorkoutSessionTimer() {
  const t = useI18n();

  const { isWorkoutActive, isTimerRunning, toggleTimer, resetTimer } = useWorkoutSession();
  console.log("isWorkoutActive:", isWorkoutActive);

  const [resetCount, setResetCount] = useState(0);

  const handleReset = () => {
    resetTimer();
    setResetCount((c) => c + 1);
  };

  if (!isWorkoutActive) {
    return null;
  }

  return (
    <div className="absolute bottom-16 left-0 right-0 flex justify-center mb-3">
      <div className="bg-white dark:bg-slate-900 rounded-full px-6 py-4 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Timer display */}
          <div className="flex items-center gap-3">
            <div className="text-xl font-mono font-bold text-slate-900 dark:text-white tracking-wider">
              <Timer initialSeconds={0} isRunning={isTimerRunning} key={resetCount} />
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-3">
            <Button
              className={cn(
                "w-12 h-12 rounded-full p-0 text-white shadow-md",
                isTimerRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600",
              )}
              onClick={toggleTimer}
            >
              {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              className="w-12 h-12 rounded-full p-0 border-slate-200 text-slate-400 hover:bg-slate-200 dark:border-slate-600 hover:dark:bg-slate-700 shadow-md"
              onClick={handleReset}
              variant="outline"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
