"use client";
import { useRouter } from "next/navigation";

import { useI18n } from "locales/client";
import { workoutSessionLocal } from "@/shared/lib/workout-session/workout-session.local";
import { WorkoutSessionList } from "@/features/workout-session/ui/workout-session-list";
import { WorkoutSessionHeatmap } from "@/features/workout-session/ui/workout-session-heatmap";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const t = useI18n();

  const sessions = typeof window !== "undefined" ? workoutSessionLocal.getAll() : [];
  const values: Record<string, number> = {};
  sessions.forEach((session) => {
    const date = session.startedAt.slice(0, 10);
    values[date] = (values[date] || 0) + 1;
  });
  const until =
    sessions.length > 0
      ? sessions.reduce((max, s) => (s.startedAt > max ? s.startedAt : max), sessions[0].startedAt).slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  return (
    <div>
      <WorkoutSessionHeatmap until={until} values={values} />
      <WorkoutSessionList />
      <div className="mt-8 flex justify-center">
        <Button onClick={() => router.push("/")} size="large">
          {t("profile.new_workout")}
        </Button>
      </div>
    </div>
  );
}
