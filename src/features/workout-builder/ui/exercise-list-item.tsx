"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Shuffle, Star, Trash2, GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { useCurrentLocale, useI18n } from "locales/client";
import { InlineTooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { ExerciseVideoModal } from "./exercise-video-modal";

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
  const locale = useCurrentLocale();
  const exerciseName = locale === "fr" ? exercise.name : exercise.nameEn;
  const [showVideo, setShowVideo] = useState(false);

  // dnd-kit sortable
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    boxShadow: isDragging ? "0 4px 16px 0 rgba(0,0,0,0.10)" : undefined,
  };

  const handleOpenVideo = () => {
    setShowVideo(true);
  };

  // Déterminer la couleur du muscle
  const getMuscleConfig = (muscle: string) => {
    const configs: Record<string, { color: string; bg: string }> = {
      ABDOMINALS: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/50" },
      BICEPS: { color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/50" },
      BACK: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50" },
      CHEST: { color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/50" },
      SHOULDERS: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/50" },
      OBLIQUES: { color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/50" },
    };
    return configs[muscle] || { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-950/50" };
  };

  const muscleConfig = getMuscleConfig(muscle);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative overflow-hidden transition-all duration-300 ease-out
        bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/70
        border-b border-slate-200 dark:border-slate-700/50
        ${isHovered ? "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50" : ""}
        ${isDragging ? "ring-2 ring-blue-400" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center justify-between py-2 px-2">
        {/* Section gauche - Infos principales */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Drag handle */}
          <GripVertical className="h-5 w-5 text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing" />

          {/* Image de l'exercice */}
          {exercise.fullVideoImageUrl && (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-700/50">
              <Image
                alt={exerciseName ?? ""}
                className="w-full h-full object-cover scale-[1.5]"
                height={40}
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  e.currentTarget.style.display = "none";
                }}
                src={exercise.fullVideoImageUrl}
                width={40}
              />
              {/* Overlay play icon */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Play className="h-3 w-3 text-white fill-current" onClick={handleOpenVideo} />
              </div>
            </div>
          )}

          {/* Badge muscle avec animation */}
          <InlineTooltip className="cursor-pointer" title={t(("workout_builder.muscles." + muscle.toLowerCase()) as keyof typeof t)}>
            <div
              className={`
            relative flex items-center justify-center w-5 h-5 rounded-sm font-bold text-xs shrink-0
            ${muscleConfig.bg} ${muscleConfig.color}
            transition-all duration-200 
            cursor-pointer
          `}
            >
              {muscle.charAt(0)}
            </div>
          </InlineTooltip>

          {/* Nom de l'exercice avec indicateurs */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm">{exerciseName}</h3>
            </div>
          </div>
        </div>

        {/* Section droite - Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Bouton shuffle */}
          <Button onClick={() => onShuffle(exercise.id, muscle)} size="small" variant="outline">
            <Shuffle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("workout_builder.exercise.shuffle")}</span>
          </Button>

          {/* Bouton pick */}
          <Button
            className={
              "bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800"
            }
            onClick={() => onPick(exercise.id)}
            size="small"
          >
            <Star className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("workout_builder.exercise.pick")}</span>
          </Button>

          {/* Bouton delete */}
          <Button
            className="h-9 w-9 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 border-0 rounded-lg  group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            onClick={() => onDelete(exercise.id, muscle)}
            size="small"
            variant="ghost"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      {exercise.fullVideoUrl && <ExerciseVideoModal exercise={exercise} onOpenChange={setShowVideo} open={showVideo} />}
    </div>
  );
}
