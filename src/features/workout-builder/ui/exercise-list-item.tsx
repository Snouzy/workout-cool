"use client";

import { useState } from "react";
import { Play, Shuffle, Star, Trash2, GripVertical } from "lucide-react";

import { useI18n } from "locales/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { ExerciseWithAttributes } from "../types";

interface ExerciseListItemProps {
  exercise: ExerciseWithAttributes;
  muscle: string;
  onShuffle: (exerciseId: string, muscle: string) => void;
  onPick: (exerciseId: string) => void;
  onDelete: (exerciseId: string, muscle: string) => void;
  isPicked?: boolean;
}

export function ExerciseListItem({ exercise, muscle, onShuffle, onPick, onDelete, isPicked = false }: ExerciseListItemProps) {
  const t = useI18n();
  const [isHovered, setIsHovered] = useState(false);

  // Extraire le premier type d'équipement
  const primaryEquipment = exercise.attributes?.find((attr) => attr.attributeName.name === "EQUIPMENT")?.attributeValue.value;

  // Déterminer la couleur du badge muscle
  const getMuscleColor = (muscle: string) => {
    const colors: Record<string, string> = {
      ABDOMINALS: "text-red-600",
      BICEPS: "text-purple-600",
      BACK: "text-blue-600",
      CHEST: "text-green-600",
      SHOULDERS: "text-orange-600",
      OBLIQUES: "text-pink-600",
    };
    return colors[muscle] || "text-slate-600";
  };

  return (
    <div
      className="group flex items-center justify-between py-3 px-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side - Drag handle, muscle badge, exercise name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Drag handle */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
        </div>

        {/* Muscle badge */}
        <Badge className={`${getMuscleColor(muscle)} text-xs font-medium border-current bg-transparent shrink-0`} variant="outline">
          {muscle.charAt(0)}
        </Badge>

        {/* Exercise name */}
        <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{exercise.name}</span>

        {/* Video icon */}
        {exercise.fullVideoUrl && (
          <Button
            className="h-8 w-8 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 shrink-0"
            size="extraSmall"
            variant="ghost"
          >
            <Play className="h-3 w-3 text-blue-600" />
          </Button>
        )}

        {/* Equipment info (subtle) */}
        {primaryEquipment && (
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
            {primaryEquipment.replace("_", " ").toLowerCase()}
          </span>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          className="h-8 px-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
          onClick={() => onShuffle(exercise.id, muscle)}
          size="extraSmall"
          variant="ghost"
        >
          <Shuffle className="h-3 w-3 mr-1" />
          {t("workout_builder.exercise.shuffle")}
        </Button>

        <Button
          className={
            isPicked
              ? "h-8 px-3 bg-blue-600 text-white hover:bg-blue-700"
              : "h-8 px-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
          }
          onClick={() => onPick(exercise.id)}
          size="extraSmall"
          variant={isPicked ? "default" : "ghost"}
        >
          <Star className={`h-3 w-3 mr-1 ${isPicked ? "fill-current" : ""}`} />
          {t("workout_builder.exercise.pick")}
        </Button>

        <Button
          className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(exercise.id, muscle)}
          size="extraSmall"
          variant="ghost"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
