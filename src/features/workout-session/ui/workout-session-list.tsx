import { useState } from "react";
import { useRouter } from "next/navigation";
import { Repeat2, Trash2 } from "lucide-react";

import { useCurrentLocale, useI18n } from "locales/client";
import { workoutSessionLocal } from "@/shared/lib/workout-session/workout-session.local";
import { useWorkoutBuilderStore } from "@/features/workout-builder/model/workout-builder.store";
import { InlineTooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import type { WorkoutSession } from "@/shared/lib/workout-session/types/workout-session";

const BADGE_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-300",
  "bg-green-100 text-green-700 border-green-300",
  "bg-red-100 text-red-700 border-red-300",
  "bg-purple-100 text-purple-700 border-purple-300",
  "bg-orange-100 text-orange-700 border-orange-300",
  "bg-pink-100 text-pink-700 border-pink-300",
];

export function WorkoutSessionList() {
  const locale = useCurrentLocale();
  const t = useI18n();
  const router = useRouter();
  const loadFromSession = useWorkoutBuilderStore((s) => s.loadFromSession);

  const [sessions, setSessions] = useState<WorkoutSession[]>(() =>
    workoutSessionLocal.getAll().sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()),
  );

  const handleDelete = (id: string) => {
    workoutSessionLocal.remove(id);
    setSessions(workoutSessionLocal.getAll().sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()));
  };

  const handleRepeat = (id: string) => {
    const sessionToCopy = sessions.find((s) => s.id === id);
    if (!sessionToCopy) return;
    // prepare data for the builder

    const allEquipment = Array.from(
      new Set(
        sessionToCopy.exercises
          .flatMap((ex) =>
            ex.attributes?.filter((attr) => attr.attributeName?.name === "EQUIPMENT").map((attr) => attr.attributeValue.value),
          )
          .filter(Boolean),
      ),
    );

    const allMuscles = Array.from(
      new Set(
        sessionToCopy.exercises
          .flatMap((ex) =>
            ex.attributes?.filter((attr) => attr.attributeName?.name === "PRIMARY_MUSCLE").map((attr) => attr.attributeValue.value),
          )
          .filter(Boolean),
      ),
    );
    const exercisesByMuscle = allMuscles.map((muscle) => ({
      muscle,
      exercises: sessionToCopy.exercises.filter((ex) =>
        ex.attributes?.some((attr) => attr.attributeName?.name === "PRIMARY_MUSCLE" && attr.attributeValue.value === muscle),
      ),
    }));

    const exercisesOrder = sessionToCopy.exercises.map((ex) => ex.id);

    // 5. inject in the builder and go step 3
    loadFromSession({
      equipment: allEquipment,
      muscles: allMuscles,
      exercisesByMuscle,
      exercisesOrder,
    });
    router.push("/");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mt-5 mb-2">{t("workout_builder.session.history", { count: sessions.length })}</h2>
      {sessions.length === 0 && <div className="text-slate-500">{t("workout_builder.session.no_workout_yet")}</div>}
      <ul className="divide-y divide-slate-200">
        {sessions.map((session) => {
          return (
            <li
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-2 sm:gap-0 hover:bg-slate-50 rounded-lg space-x-4"
              key={session.id}
            >
              <div className="flex items-center flex-col">
                <span className="font-bold text-base tabular-nums">{new Date(session.startedAt).toLocaleDateString(locale)}</span>
                <span className="text-xs text-slate-700 tabular-nums">
                  {t("workout_builder.session.start") || "start"}
                  {" : "}
                  {new Date(session.startedAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                </span>
                {session.endedAt && (
                  <span className="text-xs text-slate-500 tabular-nums">
                    {t("workout_builder.session.end") || "end"}
                    {" : "}
                    {new Date(session.endedAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {session.exercises?.map((ex, idx) => {
                  const exerciseName = locale === "fr" ? ex.name : ex.nameEn;
                  return (
                    <span
                      className={`inline-block border rounded-full px-1 text-xs font-semibold ${BADGE_COLORS[idx % BADGE_COLORS.length]}`}
                      key={ex.id}
                    >
                      {exerciseName?.toUpperCase() || t("workout_builder.session.exercise")}
                    </span>
                  );
                })}
              </div>
              <div className="flex gap-2 items-center mt-2 sm:mt-0">
                <InlineTooltip title={t("workout_builder.session.repeat")}>
                  <Button
                    aria-label={t("workout_builder.session.repeat")}
                    className="w-12 h-12"
                    onClick={() => handleRepeat(session.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Repeat2 className="w-7 h-7 text-blue-500" />
                  </Button>
                </InlineTooltip>
                <InlineTooltip title={t("workout_builder.session.delete")}>
                  <Button
                    aria-label={t("workout_builder.session.delete")}
                    onClick={() => handleDelete(session.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 className="w-7 h-7 text-red-500" />
                  </Button>
                </InlineTooltip>
              </div>
            </li>
          );
        })}
      </ul>
      {/* TODO: Ajouter un bouton pour créer une nouvelle séance (redirige vers le builder sans session courante) */}
    </div>
  );
}
