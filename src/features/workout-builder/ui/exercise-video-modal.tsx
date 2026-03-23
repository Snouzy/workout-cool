import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Crown, Lock, Play, TrendingUp, Zap } from "lucide-react";
import { useCurrentLocale, useI18n } from "locales/client";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum } from "@prisma/client";

import type { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

import { getYouTubeEmbedUrl } from "@/shared/lib/youtube";
import { useIsPremium } from "@/shared/lib/premium/use-premium";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { StatisticsTimeframe } from "@/shared/constants/statistics";
import { ExerciseCharts } from "@/features/statistics/components/ExerciseStatisticsTab";
import { TimeframeSelector } from "@/features/statistics/components";
import { getExerciseAttributesValueOf } from "@/entities/exercise/shared/muscles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ExerciseVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: ExerciseWithAttributes;
  defaultTab?: "video" | "statistics";
}

export function ExerciseVideoModal({ open, onOpenChange, exercise, defaultTab = "video" }: ExerciseVideoModalProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedTimeframe, setSelectedTimeframe] = useState<StatisticsTimeframe>("8weeks");
  const isPremium = useIsPremium();

  useEffect(() => {
    if (open) setActiveTab(defaultTab);
  }, [open, defaultTab]);

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
        {/* @ts-expect-error Tabs shadcn */}
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
                    referrerPolicy="strict-origin-when-cross-origin"
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
          </TabsContent>

          <TabsContent className="mt-0" value="statistics">
            <div className="space-y-5 px-3 md:px-6 pt-4 pb-6">
              {/* Header — title + timeframe aligned */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {t("statistics.performance_over_time")}
                  </h3>
                </div>
                <TimeframeSelector className="shrink-0" onSelect={setSelectedTimeframe} selected={selectedTimeframe} />
              </div>

              {/* Charts in card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 p-3 md:p-4">
                <ExerciseCharts exerciseId={exercise.id} timeframe={selectedTimeframe} />
              </div>

              {/* Premium teaser — Blurred advanced insights (loss aversion + Zeigarnik effect) */}
              {!isPremium && (
                <div className="relative rounded-xl border border-dashed border-amber-300 dark:border-amber-700/50 overflow-hidden">
                  {/* Blurred fake insights */}
                  <div className="select-none pointer-events-none blur-[6px] opacity-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("exercise_modal.pr_title")}</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-500">+12%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-3/4" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2.5 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">1RM Est.</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">85kg</p>
                      </div>
                      <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2.5 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Volume</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">2,400kg</p>
                      </div>
                      <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2.5 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Sessions</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">24</p>
                      </div>
                    </div>
                  </div>

                  {/* Overlay CTA */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-slate-900/30">
                    <Link
                      className=" flex flex-col items-center gap-2.5 px-6 py-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-amber-200 dark:border-amber-800 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02]"
                      href="/premium"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                          <Crown className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t("exercise_modal.unlock_insights")}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          {t("exercise_modal.feature_pr")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500" />
                          {t("exercise_modal.feature_volume")}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
