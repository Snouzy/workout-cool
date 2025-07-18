import { BarChart3 } from "lucide-react";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum } from "@prisma/client";

import { useCurrentLocale, useI18n } from "locales/client";
import { getYouTubeEmbedUrl } from "@/shared/lib/youtube";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { ExerciseCharts } from "@/features/statistics/components/ExerciseStatisticsTab";
import { getExerciseAttributesValueOf } from "@/entities/exercise/shared/muscles";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

interface ExerciseVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: ExerciseWithAttributes;
}

export function ExerciseVideoModal({ open, onOpenChange, exercise }: ExerciseVideoModalProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const title = locale === "fr" ? exercise.name : exercise.nameEn || exercise.name;
  const introduction = locale === "fr" ? exercise.introduction : exercise.introductionEn || exercise.introduction;
  const description = locale === "fr" ? exercise.description : exercise.descriptionEn || exercise.description;
  const videoUrl = exercise.fullVideoUrl;
  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoUrl ?? "");

  const type = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.TYPE);
  const pMuscles = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.PRIMARY_MUSCLE);
  const sMuscles = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.SECONDARY_MUSCLE);
  const equipment = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.EQUIPMENT);
  const mechanics = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.MECHANICS_TYPE);

  // Couleurs pour les badges
  const badgeColors: Record<string, string> = {
    TYPE: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100",
    PRIMARY_MUSCLE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    SECONDARY_MUSCLE: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
    EQUIPMENT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    MECHANICS_TYPE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
  };

  const renderBadge = (value: ExerciseAttributeValueEnum, color: string) => {
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`} key={value}>
        {getAttributeValueLabel(value, t)}
      </span>
    );
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl p-0 max-h-[80vh]">
        <DialogHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <DialogTitle className="text-lg md:text-xl font-bold flex flex-col gap-2">
            <span className="text-slate-700 dark:text-slate-200 pr-10 text-left">{title}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {type.map((type) => renderBadge(type, badgeColors.TYPE))}
              {pMuscles.map((pMuscle) => renderBadge(pMuscle, badgeColors.PRIMARY_MUSCLE))}
              {sMuscles.map((sMuscle) => renderBadge(sMuscle, badgeColors.SECONDARY_MUSCLE))}
              {equipment.map((eq) => renderBadge(eq, badgeColors.EQUIPMENT))}
              {mechanics.map((mechanic) => renderBadge(mechanic, badgeColors.MECHANICS_TYPE))}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Introduction */}
        {introduction && (
          <div
            className="px-6 pt-2 pb-2 text-slate-700 dark:text-slate-200 text-sm md:text-base prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: introduction }}
          />
        )}

        {/* Vidéo */}
        <div className="w-full aspect-video bg-black flex items-center justify-center">
          {videoUrl ? (
            youTubeEmbedUrl ? (
              <iframe
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full border-0"
                src={youTubeEmbedUrl}
                title={title ?? ""}
              />
            ) : (
              <video autoPlay className="w-full h-full object-contain bg-black" controls poster="" src={videoUrl} />
            )
          ) : (
            <div className="text-white text-center p-8">{t("workout_builder.exercise.no_video_available")}</div>
          )}
        </div>

        {/* Instructions (description) */}
        {description && (
          <div
            className="px-6 pt-4 pb-6 text-slate-700 dark:text-slate-200 text-sm md:text-base prose dark:prose-invert max-w-none border-t border-slate-200 dark:border-slate-800 mt-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {/* Statistics */}
        <div className="px-6 pt-4 pb-6 border-t border-slate-200 dark:border-slate-800 mt-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-blue-600 dark:text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t("statistics.title") || "Statistiques"}</h3>
          </div>
          <ExerciseCharts exerciseId={exercise.id} timeframe={""} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
