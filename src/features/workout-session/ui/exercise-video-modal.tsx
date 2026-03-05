import { useState } from "react";
import { BarChart3, Play } from "lucide-react";

import { useCurrentLocale, useI18n } from "locales/client";
import { getYouTubeEmbedUrl } from "@/shared/lib/youtube";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { StatisticsTimeframe } from "@/shared/constants/statistics";
import { ExerciseCharts } from "@/features/statistics/components/ExerciseStatisticsTab";
import { TimeframeSelector } from "@/features/statistics/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { BaseExercise } from "@/entities/exercise/types/exercise.types";

interface ExerciseVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: BaseExercise;
}

export function ExerciseVideoModal({ open, onOpenChange, exercise }: ExerciseVideoModalProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [activeTab, setActiveTab] = useState("video");
  const [selectedTimeframe, setSelectedTimeframe] = useState<StatisticsTimeframe>("8weeks");

  const title = locale === "fr" ? exercise.name : exercise.nameEn || exercise.name;
  const description = exercise.description;
  const videoUrl = exercise.videoUrl;
  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoUrl ?? "");

  const badgeColors: Record<string, string> = {
    category: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100",
    primaryMuscle: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    secondaryMuscle: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
    difficulty: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl p-0 max-h-[80vh]">
        <DialogHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <DialogTitle className="text-lg md:text-xl font-bold flex flex-col gap-2">
            <span className="text-slate-700 dark:text-slate-200 pr-10 text-left">{title}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColors.category}`}>
                {getAttributeValueLabel(exercise.category, t)}
              </span>
              {exercise.primaryMuscles.map((muscle) => (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColors.primaryMuscle}`} key={muscle}>
                  {getAttributeValueLabel(muscle, t)}
                </span>
              ))}
              {exercise.secondaryMuscles.map((muscle) => (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColors.secondaryMuscle}`} key={muscle}>
                  {getAttributeValueLabel(muscle, t)}
                </span>
              ))}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColors.difficulty}`}>
                {getAttributeValueLabel(exercise.difficultyLevel, t)}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs className="flex-1" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2 mx-4" style={{ width: "calc(100% - 2rem)" }}>
            <TabsTrigger className="flex items-center gap-2" value="video">
              <Play size={16} />
              {t("statistics.tabs.video")}
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="statistics">
              <BarChart3 size={16} />
              {t("statistics.title") || "Statistics"}
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-0" value="video">
            {/* Video */}
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

            {/* Description */}
            {description && (
              <div
                className="px-6 pt-4 pb-6 text-slate-700 dark:text-slate-200 text-sm md:text-base prose dark:prose-invert max-w-none border-t border-slate-200 dark:border-slate-800 mt-2"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </TabsContent>

          <TabsContent className="mt-0 px-2 md:px-6 pt-4 pb-6" value="statistics">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-col sm:flex-row">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t("statistics.performance_over_time")}</h3>
                <TimeframeSelector onSelect={setSelectedTimeframe} selected={selectedTimeframe} />
              </div>
              <ExerciseCharts exerciseId={exercise.id} timeframe={selectedTimeframe} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
