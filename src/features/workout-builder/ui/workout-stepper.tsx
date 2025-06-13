"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle, Zap, Plus } from "lucide-react";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";

import { useI18n } from "locales/client";
import Trophy from "@public/images/trophy.png";
import { workoutSessionLocal } from "@/shared/lib/workout-session/workout-session.local";
import { WorkoutSessionSets } from "@/features/workout-session/ui/workout-session-sets";
import { WorkoutSessionHeader } from "@/features/workout-session/ui/workout-session-header";
import { Button } from "@/components/ui/button";

import { StepperStepProps } from "../types";
import { useWorkoutStepper } from "../model/use-workout-stepper";
import { useWorkoutSession } from "../../workout-session/model/use-workout-session";
import { StepperHeader } from "./stepper-header";
import { MuscleSelection } from "./muscle-selection";
import { ExerciseListItem } from "./exercise-list-item";
import { EquipmentSelection } from "./equipment-selection";

import type { ExerciseWithAttributes } from "../types";

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
  const router = useRouter();

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

export function WorkoutStepper({ sessionId: propSessionId }: { sessionId?: string } = {}) {
  const t = useI18n();
  const router = useRouter();
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
    fetchExercises,
  } = useWorkoutStepper();

  // dnd-kit et flatExercises doivent être avant tout return/condition
  const [flatExercises, setFlatExercises] = useState<{ id: string; muscle: string; exercise: ExerciseWithAttributes }[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFlatExercises((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Persistance dans le localStorage
        const sessionIdToUpdate = sessionId || workoutSessionLocal.getCurrent();
        if (sessionIdToUpdate) {
          const session = workoutSessionLocal.getById(sessionIdToUpdate);
          if (session) {
            // On met à jour l'ordre dans le tableau exercises
            const newExercises = newItems.map((item, idx) => {
              const original = session.exercises.find((ex) => ex.id === item.id);
              return original
                ? { ...original, order: idx }
                : {
                    ...item.exercise,
                    order: idx,
                    sets: [],
                    exerciseId: item.id,
                  };
            });
            workoutSessionLocal.update(sessionIdToUpdate, { exercises: newExercises });
          }
        }
        return newItems;
      });
    }
  };
  useEffect(() => {
    if (exercisesByMuscle.length > 0) {
      const flat = exercisesByMuscle.flatMap((group) =>
        group.exercises.map((exercise) => ({
          id: exercise.id,
          muscle: group.muscle,
          exercise,
        })),
      );
      setFlatExercises(flat);
    }
  }, [exercisesByMuscle]);

  // Fetch exercises quand on arrive à l'étape 3
  useEffect(() => {
    if (currentStep === 3) {
      fetchExercises();
    }
  }, [currentStep, selectedEquipment, selectedMuscles]);

  const sessionId = propSessionId || workoutSessionLocal.getCurrent() || undefined;
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
    const allExercises = flatExercises.map((item) => item.exercise);

    if (allExercises.length > 0) {
      startWorkout(allExercises, selectedEquipment, selectedMuscles);
    }
  };

  const [showCongrats, setShowCongrats] = useState(false);

  if (showCongrats && !isWorkoutActive) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Image alt="Trophée" className="w-56 h-56" src={Trophy} />
        <h2 className="text-2xl font-bold mb-2">Bravo, séance terminée ! 🎉</h2>
        <p className="text-lg text-slate-600 mb-6">Tu as complété tous tes exercices.</p>
        <Button onClick={() => router.push("/profile")}>{t("commons.go_to_profile")}</Button>
      </div>
    );
  }
  if (isWorkoutActive && session) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        {!showCongrats && (
          <WorkoutSessionHeader
            currentExerciseIndex={session.exercises.findIndex((exercise) => exercise.id === currentExercise?.id)}
            elapsedTime={formatElapsedTime()}
            isTimerRunning={isTimerRunning}
            onQuitWorkout={quitWorkout}
            onResetTimer={resetTimer}
            onSaveAndQuit={() => {
              // TODO: Implémenter la sauvegarde pour plus tard
              console.log("Save workout for later");
              quitWorkout();
            }}
            onToggleTimer={toggleTimer}
            sessionId={session.id}
          />
        )}
        <WorkoutSessionSets isWorkoutActive={isWorkoutActive} onCongrats={() => setShowCongrats(true)} showCongrats={showCongrats} />
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
            ) : flatExercises.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                {/* Liste des exercices drag and drop */}
                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                >
                  <SortableContext items={flatExercises.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                      {flatExercises.map((item) => (
                        <ExerciseListItem
                          exercise={item.exercise}
                          isPicked={true}
                          key={item.id}
                          muscle={item.muscle}
                          onDelete={handleDeleteExercise}
                          onPick={handlePickExercise}
                          onShuffle={handleShuffleExercise}
                        />
                      ))}
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
                  </SortableContext>
                </DndContext>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                    disabled={flatExercises.length === 0}
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
      <StepperHeader steps={steps} />

      <div className="min-h-[400px] mb-8">{renderStepContent()}</div>

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
