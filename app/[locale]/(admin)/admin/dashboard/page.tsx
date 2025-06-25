import { Suspense } from "react";
import { Activity, Users, Dumbbell, Star } from "lucide-react";

import { prisma } from "@/shared/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  const dashboardCards = [
    {
      title: "Total Utilisateurs",
      value: stats.totalUsers.toLocaleString(),
      description: `+${stats.recentUsers} cette semaine`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Sessions d'Entraînement",
      value: stats.totalWorkoutSessions.toLocaleString(),
      description: `+${stats.recentWorkouts} cette semaine`,
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Exercices Disponibles",
      value: stats.totalExercises.toLocaleString(),
      description: "Base d'exercices",
      icon: Dumbbell,
      color: "text-purple-600",
    },
    {
      title: "Programmes Actifs",
      value: stats.totalPrograms.toLocaleString(),
      description: `${stats.activeSubscriptions} abonnements actifs`,
      icon: Star,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {dashboardCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

async function getRecentActivity() {
  const [recentUsers, recentWorkouts] = await Promise.all([
    // 3 last users
    prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    }),

    // 3 last workout sessions
    prisma.workoutSession.findMany({
      take: 3,
      orderBy: { startedAt: "desc" },
      select: {
        startedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return { recentUsers, recentWorkouts };
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "À l'instant";
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `Il y a ${diffInDays}j`;
}

async function RecentActivity() {
  const { recentUsers, recentWorkouts } = await getRecentActivity();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Les dernières actions sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div className="flex items-center space-x-4" key={index}>
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <div className="flex-1 text-sm">
                  Nouvel utilisateur : {user.firstName} {user.lastName}
                  <span className="ml-2 text-muted-foreground">{formatTimeAgo(user.createdAt)}</span>
                </div>
              </div>
            ))}

            {recentWorkouts.map((workout, index) => (
              <div className="flex items-center space-x-4" key={index}>
                <div className="h-2 w-2 rounded-full bg-green-600" />
                <div className="flex-1 text-sm">
                  Session d&apos;entraînement : {workout.user.firstName} {workout.user.lastName}
                  <span className="ml-2 text-muted-foreground">{formatTimeAgo(workout.startedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardStatsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentActivityLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Les dernières actions sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="flex items-center space-x-4" key={i}>
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton className="h-12 w-full" key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre application WorkoutCool</p>
      </div>

      <Suspense fallback={<DashboardStatsLoading />}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<RecentActivityLoading />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
