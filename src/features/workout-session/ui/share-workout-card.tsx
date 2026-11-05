"use client";

import { forwardRef } from "react";
import { Dumbbell } from "lucide-react";
import { useCurrentLocale, useI18n } from "locales/client";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { formatDate } from "@/shared/lib/date";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";

interface ShareWorkoutCardProps {
  startedAt: string;
  muscles: ExerciseAttributeValueEnum[];
  exercisesCount: number;
}

/**
 * Social-friendly summary card for a completed workout.
 * Rendered off-screen and captured as a PNG via html-to-image.
 * Uses a plain <img> for the logo so capture works reliably (Next/Image often breaks html-to-image).
 */
export const ShareWorkoutCard = forwardRef<HTMLDivElement, ShareWorkoutCardProps>(function ShareWorkoutCard(
  { startedAt, muscles, exercisesCount },
  ref,
) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const dateLabel = formatDate(startedAt, locale);
  const muscleLabels = muscles.map((muscle) => getAttributeValueLabel(muscle, t));

  return (
    <div
      className="relative flex h-[750px] w-[600px] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 p-10 text-white"
      ref={ref}
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- html-to-image needs a plain img */}
        <img alt="workout.cool" className="h-10 w-10 rounded-lg" height={40} src="/logo.png" width={40} />
        <span className="text-xl font-bold tracking-tight">workout.cool</span>
      </div>

      <div className="flex flex-col items-center text-center">
        <span aria-hidden className="text-7xl">
          🏆
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight">{t("workout_builder.session.share_card_title")}</h1>
        <p className="mt-3 text-lg text-white/85">{t("workout_builder.session.share_card_subtitle", { date: dateLabel })}</p>

        {muscleLabels.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {muscleLabels.map((label) => (
              <span className="rounded-full bg-white/15 px-4 py-1.5 text-base font-semibold" key={label}>
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/10 px-6 py-3">
          <Dumbbell className="h-6 w-6" />
          <span className="text-xl font-bold">{exercisesCount}</span>
          <span className="text-lg text-white/85">{t("workout_builder.session.share_card_exercises_label")}</span>
        </div>

        <p className="mt-8 text-xl font-semibold text-white/95">{t("workout_builder.session.share_card_motivation")}</p>
      </div>

      <p className="text-center text-sm font-medium text-white/70">{t("workout_builder.session.share_card_footer")}</p>
    </div>
  );
});
