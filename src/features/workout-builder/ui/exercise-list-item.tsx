import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Play, Shuffle, Trash2, GripVertical, Loader2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { useCurrentLocale, useI18n } from "locales/client";
import { InlineTooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { ExerciseVideoModal } from "./exercise-video-modal";
import { ExercisePickModal } from "./exercise-pick-modal";

import type { ExerciseWithAttributes } from "../types";

interface ExerciseListItemProps {
  exercise: ExerciseWithAttributes;
  muscle: string;
  onShuffle: (exerciseId: string, muscle: string) => void;
  onPick: (exerciseId: string) => void;
  onDelete: (exerciseId: string, muscle: string) => void;
  isShuffling?: boolean;
}

const MUSCLE_CONFIGS: Record<string, { color: string; bg: string }> = {
  ABDOMINALS: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/50" },
  BICEPS: { color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/50" },
  BACK: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50" },
  CHEST: { color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/50" },
  SHOULDERS: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/50" },
  OBLIQUES: { color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/50" },
};

const DEFAULT_MUSCLE_CONFIG = { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-950/50" };

export function ExerciseListItem({ exercise, muscle, onShuffle, onPick, onDelete, isShuffling }: ExerciseListItemProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [showVideo, setShowVideo] = useState(false);
  const [showPickModal, setShowPickModal] = useState(false);

  const exerciseName = useMemo(() => (locale === "fr" ? exercise.name : exercise.nameEn), [locale, exercise.name, exercise.nameEn]);
  const muscleConfig = useMemo(() => MUSCLE_CONFIGS[muscle] || DEFAULT_MUSCLE_CONFIG, [muscle]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exercise.id });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 1,
      boxShadow: isDragging ? "0 4px 16px 0 rgba(0,0,0,0.10)" : undefined,
    }),
    [transform, transition, isDragging],
  );

  // Mémoriser les handlers
  const handleOpenVideo = useCallback(() => {
    setShowVideo(true);
  }, []);

  const handleClosePickModal = useCallback(() => {
    setShowPickModal(false);
  }, []);

  const handleConfirmPick = useCallback(() => {
    onPick(exercise.id);
  }, [onPick, exercise.id]);

  const handleShuffle = useCallback(() => {
    onShuffle(exercise.id, muscle);
  }, [onShuffle, exercise.id, muscle]);

  const handleDelete = useCallback(() => {
    onDelete(exercise.id, muscle);
  }, [onDelete, exercise.id, muscle]);

  const muscleTitle = useMemo(() => t(("workout_builder.muscles." + muscle.toLowerCase()) as keyof typeof t), [t, muscle]);

  return (
    <div
      className={`
        group relative overflow-hidden transition-all duration-300 ease-out
        bg-white dark:bg-slate-900 sm:hover:bg-slate-50 dark:sm:hover:bg-slate-800/70
        border-b border-slate-200 dark:border-slate-700/50
        sm:hover:shadow-lg sm:hover:shadow-slate-200/50 dark:sm:hover:shadow-slate-900/50
        ${isDragging ? "ring-2 ring-blue-400" : ""}
      `}
      ref={setNodeRef}
      style={style}
    >
      <div className="relative flex items-center justify-between py-2 px-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Drag handle */}
          <div
            className="flex items-center justify-center p-2 -m-2 touch-manipulation cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-6 w-6 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500" />
          </div>

          {exercise.fullVideoImageUrl && (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-700/50">
              <Image
                alt={exerciseName ?? ""}
                className="w-full h-full object-cover scale-[1.5]"
                height={40}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                priority={false}
                src={exercise.fullVideoImageUrl}
                width={40}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                <Play className="h-3 w-3 text-white fill-current" onClick={handleOpenVideo} />
              </div>
            </div>
          )}

          {/* Badge muscle avec animation */}
          <InlineTooltip className="cursor-pointer" title={muscleTitle}>
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
          <InlineTooltip className="tooltip tooltip-bottom z-50 max-w-[300px]" title={exerciseName || ""}>
            <div className="flex-1 min-w-0 items">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-200 md:truncate text-sm">{exerciseName}</h3>
              </div>
            </div>
          </InlineTooltip>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-1">
          {/* Bouton shuffle */}
          <Button
            className="p-2 sm:p-2 min-h-[44px] min-w-[44px] sm:min-h-min sm:min-w-min touch-manipulation"
            disabled={isShuffling}
            onClick={handleShuffle}
            size="small"
            variant="outline"
          >
            {isShuffling ? (
              <Loader2 className="h-4 w-4 sm:h-3.5 sm:w-3.5 animate-spin" />
            ) : (
              <Shuffle className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            )}
            <span className="hidden sm:inline ml-1">{t("workout_builder.exercise.shuffle")}</span>
          </Button>

          {/* Bouton delete */}
          <Button
            className="p-2 sm:p-2 min-h-[44px] min-w-[44px] sm:min-h-min sm:min-w-min bg-red-50 dark:bg-red-950/50 sm:hover:bg-red-100 dark:sm:hover:bg-red-950 text-red-600 dark:text-red-400 border-0 rounded-lg opacity-100 sm:group-hover:opacity-100 transition-all duration-200 sm:hover:scale-110 touch-manipulation"
            onClick={handleDelete}
            size="small"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      {exercise.fullVideoUrl && <ExerciseVideoModal exercise={exercise} onOpenChange={setShowVideo} open={showVideo} />}

      {/* Pick Modal */}
      <ExercisePickModal
        exercise={exercise}
        isOpen={showPickModal}
        muscle={muscle}
        onClose={handleClosePickModal}
        onConfirmPick={handleConfirmPick}
      />
    </div>
  );
}
