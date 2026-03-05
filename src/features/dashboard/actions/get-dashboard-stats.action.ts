"use server";

import { prisma } from "@/shared/lib/prisma";

export interface DashboardStats {
  workoutsThisWeek: number;
  totalWorkouts: number;
  totalStreak: number;
  recentWorkouts: {
    id: string;
    startedAt: Date;
    duration: number | null;
  }[];
}

export async function getDashboardStats(
  userId: string
): Promise<DashboardStats> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const [workoutsThisWeek, totalWorkouts, recentWorkouts] = await Promise.all([
    prisma.workoutSession.count({
      where: {
        userId,
        startedAt: { gte: startOfWeek },
      },
    }),
    prisma.workoutSession.count({
      where: { userId },
    }),
    prisma.workoutSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 5,
      select: {
        id: true,
        startedAt: true,
        duration: true,
      },
    }),
  ]);

  return {
    workoutsThisWeek,
    totalWorkouts,
    totalStreak: totalWorkouts,
    recentWorkouts,
  };
}
