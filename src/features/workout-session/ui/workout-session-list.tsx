import { useRouter } from "next/navigation";
import { Play, Repeat2, Trash2 } from "lucide-react";

import { useCurrentLocale, useI18n } from "locales/client";
import { useWorkoutSessionService } from "@/shared/lib/workout-session/use-workout-session.service";
import { useWorkoutSessions } from "@/features/workout-session/model/use-workout-sessions";
import { useWorkoutBuilderStore } from "@/features/workout-builder/model/workout-builder.store";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";

const BADGE_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800",
  "bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
  "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700",
  "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-800",
  "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-800",
  "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900 dark:text-pink-100 dark:border-pink-800",
];

export function WorkoutSessionList() {
  const locale = useCurrentLocale();
  const t = useI18n();
  const router = useRouter();
  const loadFromSession = useWorkoutBuilderStore((s) => s.loadFromSession);
  const { remove } = useWorkoutSessionService();

  const { data: sessions = [], refetch } = useWorkoutSessions();
  const activeSession = sessions.find((s) => s.status === "active");

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t("workout_builder.confirm_delete"));

    if (!confirmed) return;

    try {
      await remove(id);
      refetch();
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Error deleting session");
    }
  };

  const handleRepeat = (id: string) => {
    const sessionToCopy = sessions.find((s) => s.id === id);
    if (!sessionToCopy) return;

    const allEquipment = Array.from(
      new Set(
        sessionToCopy.exercises
          .flatMap((ex) =>
            ex.attributes?.filter((attr) => attr.attributeName?.name === "EQUIPMENT").map((attr) => attr.attributeValue.value),
          )
          .filter(Boolean),
      ),
    );

    // Utilise les muscles stockés dans la session, sinon fallback sur les muscles primaires des exercices
    const allMuscles =
      sessionToCopy.muscles && sessionToCopy.muscles.length > 0
        ? sessionToCopy.muscles
        : Array.from(
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
      exercises: sessionToCopy.exercises
        .filter((ex) =>
          ex.attributes?.some((attr) => attr.attributeName?.name === "PRIMARY_MUSCLE" && attr.attributeValue.value === muscle),
        )
        .map((ex) => ({
          ...ex,
          id: ex.id,
          workoutSessionId: sessionToCopy.id,
          exerciseId: ex.id,
          order: ex.order,
        })),
    }));

    const exercisesOrder = sessionToCopy.exercises.map((ex) => ex.id);

    // 5. inject in the builder and go step 3
    loadFromSession({
      equipment: allEquipment,
      muscles: allMuscles,
      exercisesByMuscle,
      exercisesOrder,
    });
    router.push("/?fromSession=1");
  };

  return (
    <div className="space-y-4 mt-10">
      <h2 className="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-slate-200">
        {t("workout_builder.session.history", { count: sessions.length })}
      </h2>
      {sessions.length === 0 && <div className="text-slate-500 dark:text-slate-400">{t("workout_builder.session.no_workout_yet")}</div>}
      <ul className="divide-y divide-slate-200 dark:divide-slate-700/50">
        {sessions.map((session) => {
          const isActive = session.status === "active";
          return (
            <li
              className="px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-2 sm:gap-0 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-lg space-x-4"
              key={session.id}
            >
              <div className="flex items-center flex-col">
                <span className="font-bold text-base tabular-nums text-slate-900 dark:text-slate-200">
                  {new Date(session.startedAt).toLocaleDateString(locale)}
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 tabular-nums">
                  {t("workout_builder.session.start") || "start"}
                  {" : "}
                  {new Date(session.startedAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                </span>
                {session.endedAt && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {t("workout_builder.session.end") || "end"}
                    {" : "}
                    {new Date(session.endedAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
                {session.muscles && session.muscles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 justify-center">
                    {session.muscles.map((muscle, idx) => (
                      <span
                        // eslint-disable-next-line max-len
                        className={`inline-block border rounded-full px-2 py-0.5 text-xs font-semibold ${BADGE_COLORS[idx % BADGE_COLORS.length]}`}
                        key={muscle}
                      >
                        {t(("workout_builder.muscles." + muscle.toLowerCase()) as keyof typeof t)}
                      </span>
                    ))}
                  </div>
                )}
                {session.status === "active" && (
                  <div className="relative mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-semibold">
                      {t("commons.in_progress")}
                    </span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  </div>
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
                {isActive && (
                  <Link className="w-auto flex items-center gap-2 flex-col" href="/" variant="nav">
                    <Play className="w-7 h-7 text-blue-500 dark:text-blue-400" />
                    <span className="sr-only">{t("workout_builder.session.back_to_workout")}</span>
                    <span>{t("workout_builder.session.back_to_workout")}</span>
                  </Link>
                )}
                {!isActive && (
                  <div
                    className="tooltip tooltip-left"
                    data-tip={
                      activeSession ? t("workout_builder.session.already_have_a_active_session") : t("workout_builder.session.repeat")
                    }
                  >
                    <Button
                      aria-label={t("workout_builder.session.repeat")}
                      className="w-12 h-12"
                      disabled={!!activeSession}
                      onClick={() => handleRepeat(session.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Repeat2 className="w-7 h-7 text-blue-500 dark:text-blue-400" />
                    </Button>
                  </div>
                )}

                {!isActive && (
                  <div className="tooltip" data-tip={t("workout_builder.session.delete")}>
                    <Button
                      aria-label={t("workout_builder.session.delete")}
                      onClick={() => handleDelete(session.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="w-7 h-7 text-red-500 dark:text-red-400" />
                    </Button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {/* TODO: Ajouter un bouton pour créer une nouvelle séance (redirige vers le builder sans session courante) */}
    </div>
  );
}
