"use client";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useI18n } from "locales/client";

import { Button } from "@/components/ui/button";
import { RewardedAdGate } from "@/components/ads/custom/RewardedAdGate";

export function WorkoutBuilderFooter({
  currentStep,
  totalSteps,
  canContinue,
  onPrevious,
  onNext,
  onStartWorkout,
}: {
  currentStep: number;
  totalSteps: number;
  canContinue: boolean;
  onPrevious: VoidFunction;
  onNext: VoidFunction;
  onStartWorkout?: VoidFunction;
}) {
  const t = useI18n();
  const isFirstStep = currentStep === 1;
  const isFinalStep = currentStep === totalSteps;

  return (
    <div className="w-full sticky bottom-0 ">
      {/* Mobile layout - vertical stack */}
      <div className="flex flex-col gap-4 px-2 sm:px-6 pb-2">
        {/* Center stats on top for mobile */}

        {/* Navigation buttons */}
        <div className={`mt-4 min-h-12 flex items-center justify-between bg-white dark:bg-slate-900 w-full p-0.5 border border-slate-400 dark:border-slate-700 ${isFinalStep ? "flex-col sm:flex-row gap-2 sm:gap-3 rounded-2xl sm:rounded-full" : "flex-row gap-3 rounded-full"}`}>
          {/* Previous button */}
          <Button className={`flex-1 rounded-full min-h-12 ${isFinalStep ? "w-full" : ""}`} disabled={isFirstStep} onClick={onPrevious} size="default" variant="ghost">
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">{t("workout_builder.navigation.previous")}</span>
            </div>
          </Button>

          {/* Next/Start Workout button */}
          {isFinalStep && onStartWorkout ? (
            <RewardedAdGate onRewardGranted={onStartWorkout}>
              <Button
                asChild
                className="flex-1 w-full rounded-full bg-green-600 hover:bg-green-700 min-h-12 dark:bg-green-500 dark:hover:bg-green-600"
                disabled={!canContinue}
                size="default"
                variant="default"
              >
                <div className="flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" />
                  <span className="font-semibold">{t("workout_builder.navigation.start_workout")}</span>
                </div>
              </Button>
            </RewardedAdGate>
          ) : (
            <Button
              className="flex-1 w-full rounded-full bg-blue-600 hover:bg-blue-700 min-h-12 dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={!canContinue}
              onClick={onNext}
              size="default"
              variant="default"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="font-semibold">{t("workout_builder.navigation.continue")}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
