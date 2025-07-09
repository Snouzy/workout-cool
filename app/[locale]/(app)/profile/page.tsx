"use client";
import { useRouter } from "next/navigation";

import { useI18n } from "locales/client";
import { WorkoutSessionList } from "@/features/workout-session/ui/workout-session-list";
import { WorkoutSessionHeatmap } from "@/features/workout-session/ui/workout-session-heatmap";
import { useWorkoutSessions } from "@/features/workout-session/model/use-workout-sessions";
import { useCurrentSession } from "@/entities/user/model/useCurrentSession";
import { LocalAlert } from "@/components/ui/local-alert";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const t = useI18n();
  const { data: sessions = [] } = useWorkoutSessions();
  const session = useCurrentSession();

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
    <div className="px-2 sm:px-6">
      {!session && <LocalAlert className="my-4" />}
      {session && (
        <div className="mt-4">
          <div>
            <h2 className="text-2xl font-bold">Hello, {session.user?.name} 👋</h2>
          </div>
        </div>
      )}
      <div className="mt-4">
        <WorkoutSessionHeatmap until={until} values={values} />
      </div>
      <WorkoutSessionList />
      <div className="mt-8 flex justify-center">
        <Button onClick={() => router.push("/")} size="large">
          {t("profile.new_workout")}
        </Button>
      </div>
    </div>
  );
}
