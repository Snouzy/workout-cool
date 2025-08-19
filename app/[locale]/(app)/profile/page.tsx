"use client";
import { useRouter } from "next/navigation";
import { ExternalLink, Eye, EyeOff } from "lucide-react";

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
            <div>
              <h2 className="text-2xl font-bold">Hello, {session.user?.name} 👋</h2>
              <div className="mt-2 flex items-center gap-3">
                {/* Profile Visibility Indicator */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    session.user?.isProfilePublic
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : "bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {session.user?.isProfilePublic ? (
                    <>
                      <Eye className="size-4" />
                      Public Profile
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-4" />
                      Private Profile
                    </>
                  )}
                </div>

                {/* Public Profile Link */}
                {session.user?.isProfilePublic && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>View at: {getPublicProfileUrl()}</span>
                    <Button
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded transition-colors"
                      onClick={() => router.push(getPublicProfileUrl() || "#")}
                      size="small"
                      variant="ghost"
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
