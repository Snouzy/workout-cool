import { forwardRef } from "react";
import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { useCurrentLocale, useI18n } from "locales/client";
import Logo from "@public/logo.png";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";

interface ShareWorkoutCardProps {
  startedAt: string;
  muscles: ExerciseAttributeValueEnum[];
  exercisesCount: number;
}

/**
 * Social-friendly summary card for a completed workout, rendered off-screen
 * and captured as an image by ShareWorkoutButton via html-to-image.
 */
export const ShareWorkoutCard = forwardRef<HTMLDivElement, ShareWorkoutCardProps>(function ShareWorkoutCard(
  { startedAt, muscles, exercisesCount },
  ref,
) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const date = new Date(startedAt).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  return (
    <div
      className="relative flex h-[750px] w-[600px] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 p-10 text-white"
      ref={ref}
    >
      <div className="flex items-center gap-2">
        <Image alt="" className="h-8 w-8 rounded-md" height={32} src={Logo} width={32} />
        <span className="text-lg font-bold">Workout.cool</span>
      </div>

      <div className="flex flex-col items-center text-center">
        <span className="text-7xl">🏆</span>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight">{t("workout_builder.session.share_card_title")}</h1>
        <p className="mt-3 text-lg text-white/80">{date}</p>

        {muscles.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {muscles.map((muscle) => (
              <span className="rounded-full bg-white/15 px-4 py-1.5 text-base font-semibold" key={muscle}>
                {getAttributeValueLabel(muscle, t)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/10 px-6 py-3">
          <Dumbbell className="h-6 w-6" />
          <span className="text-xl font-bold">{exercisesCount}</span>
          <span className="text-lg text-white/80">{t("workout_builder.session.share_card_exercises_label")}</span>
        </div>
      </div>

      <p className="text-center text-sm font-medium text-white/70">{t("workout_builder.session.share_card_footer")}</p>
    </div>
  );
});
