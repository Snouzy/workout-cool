"use server";

import dayjs from "dayjs";

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
      const lastWorkout = user.WorkoutSession[0];
      const lastWorkoutAt = lastWorkout?.endedAt || lastWorkout?.startedAt || null;

      const startDate = user.createdAt;
      const weeksSinceStart = Math.max(1, Math.ceil(dayjs().diff(dayjs(startDate), "week", true)));

      const averageWorkoutsPerWeek = Math.round((totalWorkouts / weeksSinceStart) * 10) / 10;

      return {
        userId: user.id,
        userName: user.name,
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
