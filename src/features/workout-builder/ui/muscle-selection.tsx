"use client";

import React, { useEffect } from "react";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { useI18n } from "locales/client";

interface MuscleSelectionProps {
  onToggleMuscle: (muscle: ExerciseAttributeValueEnum) => void;
  selectedMuscles: ExerciseAttributeValueEnum[];
  selectedEquipment: ExerciseAttributeValueEnum[];
}

// Mapping des muscles disponibles selon l'équipement
const MUSCLE_EQUIPMENT_MAPPING: Partial<Record<ExerciseAttributeValueEnum, ExerciseAttributeValueEnum[]>> = {
  [ExerciseAttributeValueEnum.BODY_ONLY]: [
    ExerciseAttributeValueEnum.CHEST,
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.BICEPS,
    ExerciseAttributeValueEnum.TRICEPS,
    ExerciseAttributeValueEnum.FOREARMS,
    ExerciseAttributeValueEnum.ABDOMINALS,
    ExerciseAttributeValueEnum.OBLIQUES,
    ExerciseAttributeValueEnum.QUADRICEPS,
    ExerciseAttributeValueEnum.HAMSTRINGS,
    ExerciseAttributeValueEnum.GLUTES,
    ExerciseAttributeValueEnum.CALVES,
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.LATS,
    ExerciseAttributeValueEnum.TRAPS,
  ],
  [ExerciseAttributeValueEnum.DUMBBELL]: [
    ExerciseAttributeValueEnum.CHEST,
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.BICEPS,
    ExerciseAttributeValueEnum.TRICEPS,
    ExerciseAttributeValueEnum.FOREARMS,
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.LATS,
    ExerciseAttributeValueEnum.TRAPS,
    ExerciseAttributeValueEnum.QUADRICEPS,
    ExerciseAttributeValueEnum.HAMSTRINGS,
    ExerciseAttributeValueEnum.GLUTES,
    ExerciseAttributeValueEnum.CALVES,
  ],
  [ExerciseAttributeValueEnum.BARBELL]: [
    ExerciseAttributeValueEnum.CHEST,
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.BICEPS,
    ExerciseAttributeValueEnum.TRICEPS,
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.LATS,
    ExerciseAttributeValueEnum.TRAPS,
    ExerciseAttributeValueEnum.QUADRICEPS,
    ExerciseAttributeValueEnum.HAMSTRINGS,
    ExerciseAttributeValueEnum.GLUTES,
  ],
  [ExerciseAttributeValueEnum.KETTLEBELLS]: [
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.GLUTES,
    ExerciseAttributeValueEnum.HAMSTRINGS,
    ExerciseAttributeValueEnum.QUADRICEPS,
    ExerciseAttributeValueEnum.FOREARMS,
  ],
  [ExerciseAttributeValueEnum.BANDS]: [
    ExerciseAttributeValueEnum.CHEST,
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.BICEPS,
    ExerciseAttributeValueEnum.TRICEPS,
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.LATS,
    ExerciseAttributeValueEnum.GLUTES,
  ],
  [ExerciseAttributeValueEnum.WEIGHT_PLATE]: [
    ExerciseAttributeValueEnum.ABDOMINALS,
    ExerciseAttributeValueEnum.OBLIQUES,
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.CHEST,
  ],
  [ExerciseAttributeValueEnum.PULLUP_BAR]: [
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.LATS,
    ExerciseAttributeValueEnum.BICEPS,
    ExerciseAttributeValueEnum.FOREARMS,
    ExerciseAttributeValueEnum.ABDOMINALS,
  ],
  [ExerciseAttributeValueEnum.BENCH]: [
    ExerciseAttributeValueEnum.CHEST,
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.TRICEPS,
    ExerciseAttributeValueEnum.ABDOMINALS,
  ],
};

const MuscleIllustration = ({
  selectedMuscles,
  availableMuscles,
  onToggleMuscle,
  isLoading = false,
}: {
  selectedMuscles: ExerciseAttributeValueEnum[];
  availableMuscles: ExerciseAttributeValueEnum[];
  onToggleMuscle: (muscle: ExerciseAttributeValueEnum) => void;
  isLoading?: boolean;
}) => {
  useEffect(() => {
    const parentElement = document.getElementById("muscle-illustration");
    if (!parentElement) return;

    // Nettoyer les classes existantes
    const activeElements = parentElement.querySelectorAll(".muscle-active");
    activeElements.forEach((element) => {
      element.classList.remove("muscle-active");
    });

    // Appliquer les classes active pour les muscles sélectionnés
    selectedMuscles.forEach((muscle) => {
      const elements = parentElement.querySelectorAll(`[data-elem="${muscle}"]`);
      elements.forEach((element) => {
        element.classList.add("muscle-active");
      });
    });
  }, [selectedMuscles]);

  useEffect(() => {
    const parentElement = document.getElementById("muscle-illustration");
    if (!parentElement) return;

    // Nettoyer les classes enabled existantes
    const enabledElements = parentElement.querySelectorAll(".muscle-enabled");
    enabledElements.forEach((element) => {
      element.classList.remove("muscle-enabled");
    });

    // Appliquer les classes enabled pour les muscles disponibles
    availableMuscles.forEach((muscle) => {
      const elements = parentElement.querySelectorAll(`[data-elem="${muscle}"]`);
      elements.forEach((element) => {
        element.classList.add("muscle-enabled");
      });
    });
  }, [availableMuscles]);

  useEffect(() => {
    const parentElement = document.getElementById("muscle-illustration");
    if (!parentElement) return;

    const elements = parentElement.querySelectorAll(".muscle[data-elem]");
    if (isLoading) {
      elements.forEach((element) => {
        element.classList.add("muscle-loading");
      });
    } else {
      elements.forEach((element) => {
        element.classList.remove("muscle-loading");
      });
    }
  }, [isLoading]);

  useEffect(() => {
    const parentElement = document.getElementById("muscle-illustration");
    if (!parentElement) return;

    const handleHover = (event: Event) => {
      const target = event.target as HTMLElement;
      const dataElemValue = target.dataset.elem;
      if (!dataElemValue) return;

      const elements = parentElement.querySelectorAll(`.muscle[data-elem="${dataElemValue}"]`);
      elements.forEach((element) => {
        element.classList.toggle("muscle-hover");
      });
    };

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const dataElemValue = target.dataset.elem;
      const isEnabled = target.classList.contains("muscle-enabled");

      if (dataElemValue && isEnabled) {
        onToggleMuscle(dataElemValue as ExerciseAttributeValueEnum);
      }
    };

    parentElement.addEventListener("mouseover", handleHover);
    parentElement.addEventListener("mouseout", handleHover);
    parentElement.addEventListener("click", handleClick);

    return () => {
      parentElement.removeEventListener("mouseover", handleHover);
      parentElement.removeEventListener("mouseout", handleHover);
      parentElement.removeEventListener("click", handleClick);
    };
  }, [onToggleMuscle]);

  return (
    <svg
      className="cursor-pointer select-none w-full h-full max-w-lg mx-auto"
      height="100%"
      id="muscle-illustration"
      viewBox="0 0 535 462"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Torso/Body */}
      <path
        className="muscle cursor-pointer transition-all duration-200 ease-in-out fill-slate-200 stroke-slate-500 hover:fill-slate-300"
        d="M 128.00,122.83 C 132.18,123.49 136.25,123.15 140.14,121.62 145.31,119.58 149.70,116.28 153.73,112.49 154.47,111.79 154.70,110.91 154.40,109.98 153.95,108.57 153.53,107.12 152.81,105.84 149.78,100.45 146.82,95.05 144.62,89.25 143.53,86.37 139.34,82.87 136.11,83.86 131.78,85.18 127.51,86.71 123.26,88.29 119.12,89.83 116.94,93.03 116.62,97.33 116.32,101.36 116.14,105.41 116.31,109.44 116.56,115.50 121.62,121.81 128.00,122.83"
        data-elem="CHEST"
        fill="#757575"
        stroke="black"
        strokeWidth="0"
      />

      {/* Left Chest */}
      <path
        className="muscle cursor-pointer transition-all duration-200 ease-in-out fill-slate-200 stroke-slate-500 hover:fill-slate-300"
        d="M 112.42,97.33 C 112.10,93.03 109.92,89.83 105.78,88.29 101.53,86.71 97.26,85.18 92.93,83.86 89.70,82.87 85.51,86.37 84.42,89.25 82.22,95.05 79.26,100.45 76.23,105.84 75.51,107.12 75.09,108.57 74.64,109.98 74.34,110.91 74.57,111.79 75.31,112.49 79.34,116.28 83.73,119.58 88.90,121.62 92.79,123.15 96.86,123.49 101.04,122.83 107.42,121.81 112.48,115.50 112.73,109.44 112.90,105.41 112.72,101.36 112.42,97.33"
        data-elem="CHEST"
        fill="#757575"
        stroke="black"
        strokeWidth="0"
      />

      {/* Shoulders */}
      <path
        className="muscle cursor-pointer transition-all duration-200 ease-in-out fill-slate-200 stroke-slate-500 hover:fill-slate-300"
        d="M 439.90,90.50 C 439.84,91.35 440.15,91.90 440.89,92.40 442.70,93.63 444.57,94.83 446.15,96.32 449.24,99.22 452.02,102.46 455.17,105.28 459.17,108.85 463.96,110.63 469.99,110.54 470.61,110.47 471.83,110.32 473.06,110.19 473.82,110.10 474.14,109.69 474.05,108.93 473.80,106.68 473.66,104.40 473.26,102.16 472.41,97.39 470.83,92.89 467.44,89.27 463.08,84.64 457.68,81.65 451.71,79.64 450.88,79.36 449.84,79.33 448.98,79.53 444.58,80.55 440.20,85.93 439.90,90.50"
        data-elem="SHOULDERS"
        fill="#757575"
        stroke="black"
        strokeWidth="0"
      />

      <path
        className="muscle cursor-pointer transition-all duration-200 ease-in-out fill-slate-200 stroke-slate-500 hover:fill-slate-300"
        d="M 349.30,110.19 C 350.53,110.32 351.75,110.47 352.37,110.54 358.40,110.63 363.20,108.85 367.19,105.28 370.34,102.46 373.12,99.22 376.21,96.32 377.79,94.83 379.66,93.63 381.47,92.40 382.21,91.90 382.52,91.35 382.46,90.50 382.16,85.93 377.78,80.55 373.38,79.53 372.52,79.33 371.48,79.36 370.65,79.64 364.68,81.65 359.28,84.64 354.93,89.27 351.53,92.89 349.96,97.39 349.10,102.16 348.71,104.40 348.57,106.68 348.31,108.93 348.22,109.69 348.54,110.10 349.30,110.19"
        data-elem="SHOULDERS"
        fill="#757575"
        stroke="black"
        strokeWidth="0"
      />

      {/* Biceps */}
      <path
        className="muscle cursor-pointer transition-all duration-200 ease-in-out fill-slate-200 stroke-slate-500 hover:fill-slate-300"
        d="M 49.72,164.55 C 49.74,165.40 49.90,166.25 50.02,167.32 50.27,167.02 50.37,166.93 50.44,166.81 51.85,164.42 53.07,161.88 54.71,159.66 58.24,154.88 60.81,149.65 62.67,144.05 63.73,140.87 64.79,137.69 65.76,134.48 67.67,128.11 68.90,121.59 69.44,114.96 69.66,112.29 68.07,111.02 65.55,111.93 58.64,114.39 51.92,114.52 46.86,125.43 44.67,130.15 44.23,132.58 43.93,137.71 43.78,140.37 44.59,145.02 46.86,147.85 49.98,151.75 49.59,159.48 49.72,164.55"
        data-elem="BICEPS"
        fill="#757575"
        stroke="black"
        strokeWidth="0"
      />

      <path
        className="muscle cursor-pointer transition-all duration-200 ease-in-out fill-slate-200 stroke-slate-500 hover:fill-slate-300"
        d="M 160.10,114.96 C 160.64,121.59 161.87,128.11 163.78,134.48 164.74,137.69 165.80,140.87 166.86,144.05 168.73,149.65 171.29,154.88 174.82,159.66 176.46,161.88 177.68,164.42 179.09,166.81 179.16,166.93 179.26,167.02 179.52,167.32 179.64,166.25 179.80,165.40 179.82,164.55 179.94,159.48 179.56,151.75 182.68,147.85 184.94,145.02 185.76,140.37 185.60,137.71 185.30,132.58 184.87,130.15 182.68,125.43 177.61,114.52 170.89,114.39 163.98,111.93 161.46,111.02 159.88,112.29 160.10,114.96"
        data-elem="BICEPS"
        fill="#757575"
        stroke="black"
        strokeWidth="0"
      />

      {/* Abdominals */}
      <path
        className="muscle cursor-pointer transition-all duration-200 ease-in-out fill-slate-200 stroke-slate-500 hover:fill-slate-300"
        d="M 124.01,216.93 C 127.66,211.39 129.67,205.22 131.16,198.84 132.43,193.41 133.29,187.93 133.58,182.34 133.72,179.75 132.62,178.53 130.03,178.85 126.10,179.34 122.39,180.62 118.69,181.94 117.42,182.39 116.74,183.22 116.55,184.50 116.22,186.76 115.74,189.02 115.63,191.29 115.32,197.53 115.09,210.03 115.16,210.04 115.16,213.81 115.16,217.59 115.17,221.37 115.17,222.78 115.33,222.87 116.71,222.46 119.83,221.53 122.21,219.67 124.01,216.93"
        data-elem="ABDOMINALS"
        fill="#757575"
        stroke="black"
        strokeWidth="0"
      />

      {/* Add more muscle groups here following the same pattern */}

      {/* Placeholder for remaining muscles */}
      <text className="pointer-events-none" fill="#888" fontSize="12" textAnchor="middle" x="267" y="230">
        Autres muscles...
      </text>
    </svg>
  );
};

export function MuscleSelection({ onToggleMuscle, selectedMuscles, selectedEquipment }: MuscleSelectionProps) {
  const t = useI18n();

  // Calculer les muscles disponibles basés sur l'équipement sélectionné
  const availableMuscles = React.useMemo(() => {
    if (selectedEquipment.length === 0) return [];

    const muscleSet = new Set<ExerciseAttributeValueEnum>();
    selectedEquipment.forEach((equipment) => {
      const muscles = MUSCLE_EQUIPMENT_MAPPING[equipment] || [];
      muscles.forEach((muscle) => muscleSet.add(muscle));
    });

    return Array.from(muscleSet);
  }, [selectedEquipment]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-slate-600 dark:text-slate-300 text-sm italic">{t("workout_builder.selection.muscle_selection_description")}</p>
      </div>

      <div className="flex justify-center">
        <MuscleIllustration availableMuscles={availableMuscles} onToggleMuscle={onToggleMuscle} selectedMuscles={selectedMuscles} />
      </div>

      {selectedMuscles.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {selectedMuscles.length === 1
              ? `1 ${t("workout_builder.stats.muscle_selected")}`
              : `${selectedMuscles.length} ${t("workout_builder.stats.muscle_selected_plural")}`}
          </p>
        </div>
      )}
    </div>
  );
}
