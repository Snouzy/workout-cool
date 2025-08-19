"use client";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { useI18n } from "locales/client";
import { WorkoutSessionList } from "@/features/workout-session/ui/workout-session-list";
import { WorkoutSessionHeatmap } from "@/features/workout-session/ui/workout-session-heatmap";
import { useWorkoutSessions } from "@/features/workout-session/model/use-workout-sessions";
import { env } from "@/env";
import { useCurrentSession } from "@/entities/user/model/useCurrentSession";
import { LocalAlert } from "@/components/ui/local-alert";
import { Button } from "@/components/ui/button";
import { HorizontalTopBanner } from "@/components/ads";

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

  // Get user's public profile URL
  const getPublicProfileUrl = () => {
    if (!session?.user) return null;
    const username = session.user.username || session.user.email;
    return `/u/${username}`;
  };

  return (
    <div className="px-2 sm:px-6">
      {env.NEXT_PUBLIC_TOP_PROFILE_BANNER_AD_SLOT && <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_PROFILE_BANNER_AD_SLOT} />}
      {!session && <LocalAlert className="my-4" />}
      {session && (
        <div className="mt-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold">Hello, {session.user?.name} 👋</h2>
            {session.user?.isProfilePublic && (
              <Button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                onClick={() => router.push(getPublicProfileUrl() || "#")}
              >
                <ExternalLink className="size-4" />
                View Public Profile
              </Button>
            )}
          </div>
          {session.user?.isProfilePublic && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your profile is public and can be viewed at: {getPublicProfileUrl()}
            </div>
          )}
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
