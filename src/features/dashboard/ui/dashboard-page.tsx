import { Dumbbell, TrendingUp, LayoutGrid, Clock, Calendar, ArrowRight } from "lucide-react";

import { Link } from "@/components/ui/link";
import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/features/dashboard/actions/get-dashboard-stats.action";
import { UserProgressionStatus } from "@/features/progression-system/actions/get-user-progressions.action";

interface DashboardPageProps {
  stats: DashboardStats;
  progressions: UserProgressionStatus[];
  locale: string;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "-";
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

function formatDate(date: Date, locale: string): string {
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

export function DashboardPage({ stats, progressions, locale }: DashboardPageProps) {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.workoutsThisWeek}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">This week</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalWorkouts}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total workouts</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Streak</div>
        </Card>
      </div>

      {/* Progression Summary */}
      {progressions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              My Progression
            </h2>
            <Link
              className="text-sm flex items-center gap-1 !no-underline"
              href={`/${locale}/progression`}
              size="sm"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {progressions.slice(0, 4).map((prog) => (
              <Card key={prog.familyId} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm truncate">{prog.familyName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    Level {prog.currentLevel}/{prog.totalLevels}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${prog.totalLevels > 0 ? (prog.currentLevel / prog.totalLevels) * 100 : 0}%`,
                    }}
                  />
                </div>
                {prog.currentExercise && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {locale === "fr" ? prog.currentExercise.name : (prog.currentExercise.nameEn ?? prog.currentExercise.name)}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recent Workouts */}
      <section>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-500" />
          Recent Workouts
        </h2>
        {stats.recentWorkouts.length > 0 ? (
          <div className="space-y-2">
            {stats.recentWorkouts.map((workout) => (
              <Card key={workout.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">
                    {formatDate(workout.startedAt, locale)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDuration(workout.duration)}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            No workouts yet. Start your first session!
          </Card>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="grid grid-cols-3 gap-3">
          <Link
            className="!no-underline flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-center"
            href={`/${locale}/exercises`}
          >
            <Dumbbell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Exercises</span>
          </Link>
          <Link
            className="!no-underline flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-center"
            href={`/${locale}/progression`}
          >
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Progression</span>
          </Link>
          <Link
            className="!no-underline flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-center"
            href={`/${locale}/programs`}
          >
            <LayoutGrid className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Programs</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
