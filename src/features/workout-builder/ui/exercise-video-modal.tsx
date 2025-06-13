"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from "@/shared/lib/youtube";
import { useI18n } from "locales/client";

interface ExerciseVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
  title: string;
}


export function ExerciseVideoModal({ open, onOpenChange, videoUrl, title }: ExerciseVideoModalProps) {
  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const t = useI18n();

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
              <video
                autoPlay
                className="w-full h-full object-contain bg-black"
                controls
                poster=""
                src={videoUrl}
              />
            )
          ) : (
            <div className="text-white text-center p-8">
              {t("workout_builder.exercise.no_video_available")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}