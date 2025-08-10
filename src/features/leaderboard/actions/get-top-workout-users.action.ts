"use server";


import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";
import { TopWorkoutUser } from "@/features/leaderboard/models/types";

const LIMIT_TOP_USERS = 20;

export const getTopWorkoutUsersAction = actionClient.action(async () => {
  try {
    const topUsers = await prisma.user.findMany({
      where: {
        WorkoutSession: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            WorkoutSession: true,
          },
        },
        WorkoutSession: {
          select: {
            endedAt: true,
            startedAt: true,
          },
          orderBy: {
            startedAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        WorkoutSession: {
          _count: "desc",
        },
      },
      take: LIMIT_TOP_USERS,
    });

    const users: TopWorkoutUser[] = topUsers.map((user) => {
      const totalWorkouts = user._count.WorkoutSession;
      const firstWorkout = user.WorkoutSession[0];
      const lastWorkout = user.WorkoutSession[0];
      const lastWorkoutAt = lastWorkout?.endedAt || lastWorkout?.startedAt || null;

      // Calculate weeks since first workout or account creation
      const startDate = firstWorkout?.startedAt || user.createdAt;
      const now = new Date();
      const weeksSinceStart = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));

      // Calculate average workouts per week
      const averageWorkoutsPerWeek = Math.round((totalWorkouts / weeksSinceStart) * 10) / 10; // Round to 1 decimal

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        totalWorkouts,
        lastWorkoutAt: lastWorkoutAt,
        averageWorkoutsPerWeek,
        memberSince: user.createdAt,
      };
    });


    return users;
  } catch (error) {
    console.error("Error fetching top workout users:", error);
    throw new Error("Failed to fetch top workout users");
  }
});
