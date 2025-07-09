import { Suspense } from "react";
import Image from "next/image";
import { Users, Target } from "lucide-react";

import { prisma } from "@/shared/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";

async function getDashboardStats() {
  const [totalUsers, totalWorkoutSessions, totalExercises, activeSubscriptions, recentUsers, recentWorkouts, totalPrograms] =
    await Promise.all([
      // Total users
      prisma.user.count(),

      // Total workout sessions
      prisma.workoutSession.count(),

      // Total exercises
      prisma.exercise.count(),

      // Active subscriptions
      prisma.subscription.count({
        where: {
          status: "ACTIVE",
        },
      }),

      // Users created in last 7 days
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Workout sessions in last 7 days
      prisma.workoutSession.count({
        where: {
          startedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Total programs
      prisma.program.count(),
    ]);

  return {
    totalUsers,
    totalWorkoutSessions,
    totalExercises,
    activeSubscriptions,
    recentUsers,
    recentWorkouts,
    totalPrograms,
  };
}

async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <div className="group col-span-3">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-blue-300 dark:border-gray-700 dark:from-blue-950/50 dark:to-blue-900/30 dark:hover:border-blue-600">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center space-x-2">
                  <div className="rounded-xl bg-blue-500 p-2">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">Communauté</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Utilisateurs</p>
                  <span className="font-semibold text-green-600 dark:text-green-400">+{stats.recentUsers}</span> cette semaine
                </p>
              </div>
              <div className="transition-transform duration-200 group-hover:rotate-6">
                <Image alt="Happy mascot" className="h-12 w-12" height={48} src="/images/emojis/WorkoutCoolHappy.png" width={48} />
              </div>
            </div>
          </div>
        </div>

        {/* Workout Sessions Card */}
        <div className="group col-span-2 md:col-span-1">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-100 p-4 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-green-300 dark:border-gray-700 dark:from-green-950/50 dark:to-emerald-900/30 dark:hover:border-green-600">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-green-500 p-2">
                <Image
                  alt="Swag mascot"
                  className="h-8 w-8 transition-transform duration-200 group-hover:scale-110"
                  height={32}
                  src="/images/emojis/WorkoutCoolSwag.png"
                  width={32}
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWorkoutSessions.toLocaleString()}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">Sessions</p>
            <p className="text-xs text-green-600 dark:text-green-400">+{stats.recentWorkouts} cette semaine</p>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {/* Programs Card */}
        <div className="group">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-yellow-100 p-4 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-amber-300 dark:border-gray-700 dark:from-amber-950/50 dark:to-yellow-900/30 dark:hover:border-amber-600">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-amber-500 p-2">
                <Image
                  alt="Wooow mascot"
                  className="h-8 w-8 transition-transform duration-200 group-hover:scale-110"
                  height={32}
                  src="/images/emojis/WorkoutCoolWooow.png"
                  width={32}
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalPrograms.toLocaleString()}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">Programmes</p>
          </div>
        </div>

        <div className="group">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-violet-100 p-4 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-purple-300 dark:border-gray-700 dark:from-purple-950/50 dark:to-violet-900/30 dark:hover:border-purple-600">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-purple-500 p-2">
                <Image
                  alt="Love mascot"
                  className="h-8 w-8 transition-transform duration-200 group-hover:scale-110"
                  height={32}
                  src="/images/emojis/WorkoutCoolBiceps.png"
                  width={32}
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalExercises.toLocaleString()}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">Exercices</p>
          </div>
        </div>

        {/* Growth Card */}
        <div className="group">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-blue-100 p-4 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-cyan-300 dark:border-gray-700 dark:from-cyan-950/50 dark:to-blue-900/30 dark:hover:border-cyan-600">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-cyan-500 p-2">
                <Image
                  alt="Teeth mascot"
                  className="h-8 w-8 transition-transform duration-200 group-hover:scale-110"
                  height={32}
                  src="/images/emojis/WorkoutCoolTeeths.png"
                  width={32}
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">Abonnés</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardStatsLoading() {
  return (
    <div className="grid gap-4 md:gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <div className="col-span-2 md:col-span-2">
          <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
            <Skeleton className="mb-4 h-6 w-24" />
            <Skeleton className="mb-2 h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
          <Skeleton className="mb-3 h-6 w-full" />
          <Skeleton className="mb-2 h-6 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
          <Skeleton className="mb-3 h-6 w-full" />
          <Skeleton className="mb-2 h-6 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700" key={i}>
            <Skeleton className="mb-3 h-6 w-full" />
            <Skeleton className="mb-2 h-6 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-3">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Admin</h1>
          <p className="text-gray-600 dark:text-gray-300">WorkoutCool Admin</p>
        </div>
      </div>

      <Suspense fallback={<DashboardStatsLoading />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
