"use client";

import { useI18n } from "locales/client";
import { getYouTubeEmbedUrl } from "@/shared/lib/youtube";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { ExerciseWithAttributes } from "../types";

interface ExerciseVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: ExerciseWithAttributes;
}

export function ExerciseVideoModal({ open, onOpenChange, exercise }: ExerciseVideoModalProps) {
  console.log("exercise:", exercise);
  const t = useI18n();
  const locale = typeof window !== "undefined" && window.navigator.language.startsWith("fr") ? "fr" : "en";
  const title = locale === "fr" ? exercise.name : exercise.nameEn || exercise.name;
  const videoUrl = exercise.fullVideoUrl;
  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoUrl ?? "");

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full aspect-video bg-black flex items-center justify-center">
          {videoUrl ? (
            youTubeEmbedUrl ? (
              <iframe
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full border-0"
                src={youTubeEmbedUrl}
                title={title}
              />
            ) : (
              <video autoPlay className="w-full h-full object-contain bg-black" controls poster="" src={videoUrl} />
            )
          ) : (
            <div className="text-white text-center p-8">{t("workout_builder.exercise.no_video_available")}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
