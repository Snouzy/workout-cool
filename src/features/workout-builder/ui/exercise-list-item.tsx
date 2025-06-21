import React, { useState } from "react";
import Image from "next/image";
import { Play, Shuffle, Trash2, GripVertical, Loader2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { useCurrentLocale } from "locales/client";

import { ExerciseVideoModal } from "./exercise-video-modal";

import type { ExerciseWithAttributes } from "../types";

interface ExerciseListItemProps {
  exercise: ExerciseWithAttributes;
  muscle: string;
  onShuffle: (exerciseId: string, muscle: string) => void;
  onPick: (exerciseId: string) => void;
  onDelete: (exerciseId: string, muscle: string) => void;
  isShuffling?: boolean;
}

export const ExerciseListItem = React.memo(function ExerciseListItem({
  exercise,
  muscle,
  onShuffle,
  onDelete,
  isShuffling,
}: Omit<ExerciseListItemProps, "onPick">) {
  const locale = useCurrentLocale();
  const [showVideo, setShowVideo] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id: exercise.id });

  const exerciseName = locale === "fr" ? exercise.name : exercise.nameEn;

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 ${isDragging ? "shadow-lg" : ""}`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        zIndex: isDragging ? 1000 : 1,
        position: isDragging ? "relative" : "static",
      }}
    >
      <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-slate-400" />
      </div>

      {exercise.fullVideoImageUrl && (
        <div
          className="relative h-10 w-10 rounded overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 cursor-pointer"
          onClick={() => setShowVideo(true)}
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

      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title={muscle} />

      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{exerciseName}</span>
      </div>

      <button
        className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        disabled={isShuffling}
        onClick={() => onShuffle(exercise.id, muscle)}
      >
        {isShuffling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shuffle className="h-4 w-4" />}
      </button>

      <button
        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        onClick={() => onDelete(exercise.id, muscle)}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {exercise.fullVideoUrl && <ExerciseVideoModal exercise={exercise} onOpenChange={setShowVideo} open={showVideo} />}
    </div>
  );
});
