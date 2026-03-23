import React, { useCallback } from "react";
import Image from "next/image";
import { Play, Shuffle, Trash2, GripVertical, Loader2, BarChart3 } from "lucide-react";
import { useCurrentLocale, useI18n } from "locales/client";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { ExerciseVideoModal } from "./exercise-video-modal";

import type { ExerciseWithAttributes } from "../types";

import useBoolean from "@/shared/hooks/useBoolean";
import { Button } from "@/components/ui/button";

const MUSCLE_CONFIGS: Record<string, string> = {
  ABDOMINALS: "bg-red-500",
  BICEPS: "bg-purple-500",
  BACK: "bg-blue-500",
  CHEST: "bg-green-500",
  SHOULDERS: "bg-orange-500",
  OBLIQUES: "bg-pink-500",
};

interface ExerciseListItemProps {
  exercise: ExerciseWithAttributes;
  muscle: string;
  onShuffle: (exerciseId: string, muscle: string) => void;
  onPick: (exerciseId: string) => void;
  onDelete: (exerciseId: string, muscle: string) => void;
  isShuffling?: boolean;
  isActive?: boolean;
  onShuffleFeedback?: () => void;
  onDeleteFeedback?: () => void;
}

export const ExerciseListItem = React.memo(function ExerciseListItem({
  exercise,
  muscle,
  onShuffle,
  onDelete,
  isShuffling,
  isActive,
  onShuffleFeedback,
  onDeleteFeedback,
}: Omit<ExerciseListItemProps, "onPick">) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const playVideo = useBoolean();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: exercise.id,
    transition: {
      duration: 250,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const exerciseName = locale === "fr" ? exercise.name : exercise.nameEn;
  const muscleColor = MUSCLE_CONFIGS[muscle] || "bg-gray-500";
  const muscleTitle = t(("workout_builder.muscles." + muscle.toLowerCase()) as keyof typeof t);

  const handleShuffle = useCallback(() => {
    onShuffleFeedback?.();
    onShuffle(exercise.id, muscle);
  }, [onShuffle, exercise.id, muscle, onShuffleFeedback]);

  const handleDelete = useCallback(() => {
    onDeleteFeedback?.();
    onDelete(exercise.id, muscle);
  }, [onDelete, exercise.id, muscle, onDeleteFeedback]);

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b border-slate-200 dark:border-slate-700 select-none transition-[box-shadow,background-color] duration-200 ${
        isDragging
          ? "shadow-xl shadow-blue-500/15 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg"
          : isActive
            ? ""
            : "bg-white dark:bg-slate-900"
      }`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 1,
        position: isDragging ? "relative" : "static",
        scale: isDragging ? "1.02" : "1",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <div
        className="cursor-grab active:cursor-grabbing touch-none select-none p-1 -m-1"
        style={{ touchAction: "none" }}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
      </div>

      {exercise.fullVideoImageUrl && (
        <div
          className="relative h-8 w-8 sm:h-10 sm:w-10 rounded overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-700/50"
          onClick={playVideo.setTrue}
        >
          <Image
            alt={exerciseName ?? ""}
            className="w-full h-full object-cover scale-[1.5]"
            height={32}
            loading="lazy"
            src={exercise.fullVideoImageUrl}
            width={32}
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Play className="h-3 w-3 text-white fill-current" />
          </div>
        </div>
      )}

      <div
        className={`tooltip tooltip-bottom w-4 h-4 sm:w-5 sm:h-5 rounded text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer ${muscleColor}`}
        data-tip={muscleTitle}
      >
        {muscle.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 block truncate">{exerciseName}</span>
      </div>

      <Button
        className="p-2 sm:p-2 min-h-[44px] min-w-[44px] sm:min-h-min sm:min-w-min touch-manipulation"
        disabled={isShuffling}
        onClick={handleShuffle}
        size="small"
        variant="outline"
      >
        {isShuffling ? <Loader2 className="h-4 w-4 sm:h-3.5 sm:w-3.5 animate-spin" /> : <Shuffle className="h-4 w-4 sm:h-3.5 sm:w-3.5" />}
        <span className="hidden sm:inline ml-1">{t("workout_builder.exercise.shuffle")}</span>
      </Button>

      <button
        className="p-1 sm:p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        onClick={playVideo.setTrue}
      >
        <BarChart3 className="h-4 w-4" />
      </button>

      <button className="p-1 sm:p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </button>

      {exercise.fullVideoUrl && <ExerciseVideoModal exercise={exercise} onOpenChange={playVideo.toggle} open={playVideo.value} />}
    </div>
  );
});
