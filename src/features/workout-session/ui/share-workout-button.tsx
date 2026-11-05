"use client";

import { useRef, useState } from "react";
import { Loader2, Share2 } from "lucide-react";
import { useI18n } from "locales/client";
import { toBlob } from "html-to-image";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { ShareWorkoutCard } from "./share-workout-card";

import { Button } from "@/components/ui/button";

interface ShareWorkoutButtonProps {
  startedAt: string;
  muscles: ExerciseAttributeValueEnum[];
  exercisesCount: number;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function ShareWorkoutButton({ startedAt, muscles, exercisesCount }: ShareWorkoutButtonProps) {
  const t = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShare = async () => {
    const node = cardRef.current;
    if (!node || isGenerating) return;

    setIsGenerating(true);
    try {
      const blob = await toBlob(node, { pixelRatio: 2 });
      if (!blob) return;

      const fileName = "workout-cool-summary.png";
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t("workout_builder.session.share_card_title"),
        });
      } else {
        downloadBlob(blob, fileName);
      }
    } catch (error) {
      // AbortError is thrown when the user cancels the native share sheet — not a failure.
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to generate workout share image", error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button disabled={isGenerating} onClick={handleShare} variant="secondary">
        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
        {t("workout_builder.session.share_success")}
      </Button>

      {/* Rendered off-screen; only used as a source for html-to-image capture. */}
      <div aria-hidden className="pointer-events-none fixed left-[-9999px] top-0" style={{ transform: "translateZ(0)" }}>
        <ShareWorkoutCard exercisesCount={exercisesCount} muscles={muscles} ref={cardRef} startedAt={startedAt} />
      </div>
    </>
  );
}
