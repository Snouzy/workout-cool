"use client";
import { ArrowLeft, ArrowRight, CheckCircle, Zap } from "lucide-react";

import { useI18n } from "locales/client";
import { Button } from "@/components/ui/button";

export function WorkoutBuilderFooter({
  currentStep,
  totalSteps,
  canContinue,
  onPrevious,
  onNext,
  selectedEquipment,
  selectedMuscles,
}: {
  currentStep: number;
  totalSteps: number;
  canContinue: boolean;
  onPrevious: VoidFunction;
  onNext: VoidFunction;
  selectedEquipment: any[];
  selectedMuscles: any[];
}) {
  const t = useI18n();
  const isFirstStep = currentStep === 1;
  const isFinalStep = currentStep === totalSteps;

  return (
    <div className="w-full">
      {/* Mobile layout - vertical stack */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* Center stats on top for mobile */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-2 rounded-full dark:border-slate-700 shadow-sm">
            {currentStep === 1 && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {t("workout_builder.stats.equipment_selected", { count: selectedEquipment.length })}
                </span>
              </div>
            )}
            {currentStep === 2 && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {t("workout_builder.stats.muscle_selected", { count: selectedMuscles.length })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3">
          {/* Previous button */}
          <Button className="flex-1" disabled={isFirstStep} onClick={onPrevious} size="default" variant="ghost">
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">{t("workout_builder.navigation.previous")}</span>
            </div>
          </Button>

          {/* Next/Complete button */}
          <Button
            className="flex-1"
            disabled={!canContinue}
            onClick={isFinalStep ? () => console.log("Complete workout!") : onNext}
            size="default"
            variant="default"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">
                {isFinalStep ? t("workout_builder.navigation.complete") : t("workout_builder.navigation.continue")}
              </span>
              {!isFinalStep && <ArrowRight className="h-4 w-4" />}
              {isFinalStep && <CheckCircle className="h-4 w-4" />}
            </div>
          </Button>
        </div>
      </div>

      {/* Desktop layout - horizontal */}
      <div className="hidden md:flex items-center justify-between">
        {/* Previous button */}
        <Button disabled={isFirstStep} onClick={onPrevious} size="large" variant="ghost">
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">{t("workout_builder.navigation.previous")}</span>
          </div>
        </Button>

        {/* Center stats */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-6 py-3 rounded-full dark:border-slate-700 shadow-sm">
          {currentStep === 1 && (
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {t("workout_builder.stats.equipment_selected", { count: selectedEquipment.length })}
              </span>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {t("workout_builder.stats.muscle_selected", { count: selectedMuscles.length })}
              </span>
            </div>
          )}
          {/* Next step */}
        </div>
        {currentStep !== 3 && (
          <Button disabled={!canContinue} onClick={onNext} size="large" variant="default">
            <div className="flex items-center gap-2">
              <span className="font-medium">{t("commons.next")}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
