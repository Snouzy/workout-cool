"use client";

import React from "react";
import { Check } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { StepperStepProps } from "../types";

interface StepperHeaderProps {
  steps: StepperStepProps[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

function StepperStep({
  description,
  isActive,
  isCompleted,
  stepNumber,
  title,
  currentStep,
  onStepClick,
}: StepperStepProps & { currentStep: number; onStepClick?: (stepNumber: number) => void }) {
  const canClick = stepNumber < currentStep || isCompleted;

  const handleClick = () => {
    if (canClick && onStepClick) {
      onStepClick(stepNumber);
    }
  };

  return (
    <>
      {/* Layout mobile - vertical avec texte à droite */}
      <div className="flex items-center text-left md:hidden">
        {/* Cercle */}
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 flex-shrink-0",
            {
              "border-green-500 bg-green-500 text-white": isCompleted,
              "border-blue-500 bg-blue-500 text-white": isActive,
              "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500":
                !isActive && !isCompleted,
            },
            canClick ? "cursor-pointer" : "cursor-default",
          )}
          onClick={handleClick}
        >
          {isCompleted ? <Check className="h-6 w-6" /> : <span className="text-sm font-semibold">{stepNumber}</span>}
        </div>

        {/* Contenu textuel à droite */}
        <div className="ml-4">
          <h3
            className={cn("font-semibold text-sm transition-colors", {
              "text-green-600 dark:text-green-400": isCompleted,
              "text-blue-600 dark:text-blue-400": isActive,
              "text-gray-500 dark:text-gray-400": !isActive && !isCompleted,
            })}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-xs mt-1 transition-colors",
              isActive || isCompleted ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500",
            )}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Layout desktop - horizontal avec texte en bas */}
      <div className="hidden md:flex flex-col items-center text-center">
        {/* Cercle */}
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200",
            {
              "border-green-500 bg-green-500 text-white": isCompleted,
              "border-blue-500 bg-blue-500 text-white": isActive,
              "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500":
                !isActive && !isCompleted,
            },
            canClick ? "cursor-pointer" : "cursor-default",
          )}
          onClick={handleClick}
        >
          {isCompleted ? <Check className="h-6 w-6" /> : <span className="text-sm font-semibold">{stepNumber}</span>}
        </div>

        {/* Contenu textuel en bas */}
        <div className="mt-3">
          <h3
            className={cn("font-semibold text-sm transition-colors", {
              "text-green-600 dark:text-green-400": isCompleted,
              "text-blue-600 dark:text-blue-400": isActive,
              "text-gray-500 dark:text-gray-400": !isActive && !isCompleted,
            })}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-xs mt-1 transition-colors",
              isActive || isCompleted ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500",
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </>
  );
}

export function StepperHeader({ steps, currentStep, onStepClick }: StepperHeaderProps) {
  return (
    <div className={cn("w-full my-8 px-2 sm:px-6")}>
      {/* Layout mobile - vertical */}
      <div className="flex flex-col space-y-6 md:hidden">
        {steps.map((step, index) => (
          <div className="relative" key={step.stepNumber}>
            <StepperStep {...step} currentStep={currentStep} onStepClick={onStepClick} />

            {/* Ligne de connexion verticale */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-6 -translate-x-0.5">
                <div
                  className={cn(
                    "w-full h-full transition-colors duration-300",
                    step.isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600",
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Layout desktop - horizontal */}
      <div className="hidden md:flex items-start">
        {steps.map((step, index) => (
          <React.Fragment key={step.stepNumber}>
            {/* Étape */}
            <div className="flex flex-col items-center">
              <StepperStep {...step} currentStep={currentStep} onStepClick={onStepClick} />
            </div>

            {/* Ligne de connexion horizontale */}
            {index < steps.length - 1 && (
              <div className="flex-1 flex items-center pt-6">
                <div
                  className={cn(
                    "w-full h-1 transition-colors duration-300",
                    step.isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
