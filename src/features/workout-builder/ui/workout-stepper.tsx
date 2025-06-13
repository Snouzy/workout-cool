"use client";

import { ArrowLeft, ArrowRight, CheckCircle, Zap, Plus } from "lucide-react";

import { useI18n } from "locales/client";
import { WorkoutExerciseSets } from "@/features/workout-session/ui/WorkoutExerciseSets";
import { WorkoutSessionHeader } from "@/features/workout-builder/ui/workout-session-header";
import { Button } from "@/components/ui/button";

import { StepperStepProps } from "../types";
import { useWorkoutStepper } from "../model/use-workout-stepper";
import { useWorkoutSession } from "../model/use-workout-session";
import { StepperHeader } from "./stepper-header";
import { MuscleSelection } from "./muscle-selection";
import { ExerciseListItem } from "./exercise-list-item";
import { EquipmentSelection } from "./equipment-selection";

function NavigationFooter({
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
  onPrevious: () => void;
  onNext: () => void;
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
        </div>

        {/* Next/Complete button */}
        <Button
          disabled={!canContinue}
          onClick={isFinalStep ? () => console.log("Complete workout!") : onNext}
          size="large"
          variant="default"
        >
          <div className="relative flex items-center gap-2">
            <span className="font-semibold">
              {isFinalStep ? t("workout_builder.navigation.complete_workout") : t("workout_builder.navigation.continue")}
            </span>
            {!isFinalStep && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            {isFinalStep && <CheckCircle className="h-4 w-4" />}
          </div>
        </Button>
      </div>
    </div>
  );
}

export function WorkoutStepper() {
  const t = useI18n();
  const {
    currentStep,
    selectedEquipment,
    nextStep,
    prevStep,
    toggleEquipment,
    clearEquipment,
    selectedMuscles,
    toggleMuscle,
    canProceedToStep2,
    canProceedToStep3,
    isLoadingExercises,
    exercisesByMuscle,
    exercisesError,
  } = useWorkoutStepper();

  const {
    isWorkoutActive,
    session,
    startWorkout,
    currentExercise,
    formatElapsedTime,
    isTimerRunning,
    toggleTimer,
    resetTimer,
    quitWorkout,
  } = useWorkoutSession();

  const canContinue = currentStep === 1 ? canProceedToStep2 : currentStep === 2 ? canProceedToStep3 : exercisesByMuscle.length > 0;

  // Actions pour les exercices
  const handleShuffleExercise = (exerciseId: string, muscle: string) => {
    // TODO: Implémenter la logique pour remplacer l'exercice par un autre
    console.log("Shuffle exercise:", exerciseId, "for muscle:", muscle);
  };

  const handlePickExercise = (exerciseId: string) => {
    // later
    console.log("Pick exercise:", exerciseId);
  };

  const handleDeleteExercise = (exerciseId: string, muscle: string) => {
    // TODO: Implémenter la logique pour supprimer l'exercice
    console.log("Delete exercise:", exerciseId, "for muscle:", muscle);
  };

  const handleAddExercise = () => {
    // TODO: Implémenter la logique pour ajouter un exercice
    console.log("Add exercise");
  };
  const handleStartWorkout = () => {
    const allExercises = exercisesByMuscle.flatMap((group) => group.exercises);

    if (allExercises.length > 0) {
      startWorkout(allExercises, selectedEquipment, selectedMuscles);
    }
  };
  console.log("isWorkoutActive:", isWorkoutActive);

  // Si un entraînement est actif, afficher l'interface d'entraînement
  if (isWorkoutActive && session) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <WorkoutSessionHeader
          currentExerciseIndex={session.exercises.findIndex((exercise) => exercise.id === currentExercise?.id)}
          elapsedTime={formatElapsedTime()}
          exerciseName={currentExercise?.name}
          isTimerRunning={isTimerRunning}
          onQuitWorkout={quitWorkout}
          onResetTimer={resetTimer}
          onSaveAndQuit={() => {
            // TODO: Implémenter la sauvegarde pour plus tard
            console.log("Save workout for later");
            quitWorkout();
          }}
          onToggleTimer={toggleTimer}
          totalExercises={session.exercises.length}
        />

        <WorkoutExerciseSets />
      </div>
    );
  }

  const STEPPER_STEPS: StepperStepProps[] = [
    {
      stepNumber: 1,
      title: t("workout_builder.steps.equipment.title"),
      description: t("workout_builder.steps.equipment.description"),
      isActive: false,
      isCompleted: false,
    },
    {
      stepNumber: 2,
      title: t("workout_builder.steps.muscles.title"),
      description: t("workout_builder.steps.muscles.description"),
      isActive: false,
      isCompleted: false,
    },
    {
      stepNumber: 3,
      title: t("workout_builder.steps.exercises.title"),
      description: t("workout_builder.steps.exercises.description"),
      isActive: false,
      isCompleted: false,
    },
  ];

  const steps = STEPPER_STEPS.map((step) => ({
    ...step,
    isActive: step.stepNumber === currentStep,
    isCompleted: step.stepNumber < currentStep,
  }));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <EquipmentSelection onClearEquipment={clearEquipment} onToggleEquipment={toggleEquipment} selectedEquipment={selectedEquipment} />
        );
      case 2:
        return <MuscleSelection onToggleMuscle={toggleMuscle} selectedEquipment={selectedEquipment} selectedMuscles={selectedMuscles} />;
      case 3:
        return (
          <div className="space-y-6">
            {isLoadingExercises ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{t("workout_builder.loading.exercises")}</p>
              </div>
            ) : exercisesByMuscle.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                {/* Liste des exercices */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {exercisesByMuscle.map((group) => (
                    <div key={group.muscle}>
                      {group.exercises.map((exercise) => (
                        <ExerciseListItem
                          exercise={exercise}
                          isPicked={true}
                          key={exercise.id}
                          muscle={group.muscle}
                          onDelete={handleDeleteExercise}
                          onPick={handlePickExercise}
                          onShuffle={handleShuffleExercise}
                        />
                      ))}
                    </div>
                  ))}

                  {/* Add exercise button */}
                  <div className="border-t border-slate-200 dark:border-slate-800">
                    <button
                      className="w-full flex items-center gap-3 py-4 px-4 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                      onClick={handleAddExercise}
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Add</span>
                    </button>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button className="px-8" size="large" variant="outline">
                    Save for later
                  </Button>
                  <Button
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                    disabled={exercisesByMuscle.length === 0}
                    onClick={handleStartWorkout}
                    size="large"
                  >
                    Start Workout
                  </Button>
                </div>
              </div>
            ) : exercisesError ? (
              <div className="text-center py-20">
                <p className="text-red-600 dark:text-red-400">{t("workout_builder.error.loading_exercises")}</p>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-600 dark:text-slate-400">{t("workout_builder.no_exercises_found")}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* En-tête du stepper */}
      <StepperHeader steps={steps} />

      {/* Contenu de l'étape actuelle */}
      <div className="min-h-[400px] mb-8">{renderStepContent()}</div>

      {/* Navigation footer gamifiée */}
      <NavigationFooter
        canContinue={canContinue}
        currentStep={currentStep}
        onNext={nextStep}
        onPrevious={prevStep}
        selectedEquipment={selectedEquipment}
        selectedMuscles={selectedMuscles}
        totalSteps={STEPPER_STEPS.length}
      />
    </div>
  );
}
