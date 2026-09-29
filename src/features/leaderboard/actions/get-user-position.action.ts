"use server";

import { z } from "zod";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";
import { getDateRangeForPeriod } from "@/features/leaderboard/lib/utils";

const inputSchema = z.object({
  userId: z.string(),
  period: z.enum(["all-time", "weekly", "monthly"]).default("all-time"),
});

export const getUserPositionAction = actionClient.schema(inputSchema).action(async ({ parsedInput }) => {
  const { userId, period } = parsedInput;

  try {
    const { startDate, endDate } = getDateRangeForPeriod(period);

    // Only count sessions the user actually finished. Abandoned sessions keep
    // status "active" with endedAt null and would otherwise inflate counts.
    const completedSessionFilter = {
      endedAt: { not: null },
      ...(startDate && { startedAt: { gte: startDate, lte: endDate } }),
    };

    // Get user's workout count
    const userWorkoutCount = await prisma.workoutSession.count({
      where: {
        userId,
        ...completedSessionFilter,
      },
    });

    // Calculate real position
    const totalUsersWithWorkouts = await prisma.user.count({
      where: {
        WorkoutSession: {
          some: completedSessionFilter,
        },
      },
    });

    // Get all users sorted by workout count to find exact position
    const allUsers = await prisma.user.findMany({
      where: {
        WorkoutSession: {
          some: completedSessionFilter,
        },
      },
      select: {
        id: true,
        _count: {
          select: {
            WorkoutSession: {
              where: completedSessionFilter,
            },
          },
        },
      },
      orderBy: {
        WorkoutSession: {
          _count: "desc",
        },
      },
    });

    // Order by the number of *completed* sessions so abandoned ones cannot
    // push a user up the ranking (the DB _count orderBy above is unfiltered).
    allUsers.sort((a, b) => b._count.WorkoutSession - a._count.WorkoutSession);

    const position = allUsers.findIndex((user) => user.id === userId) + 1;

    return {
      position: position || totalUsersWithWorkouts + 1,
      totalWorkouts: userWorkoutCount,
      totalUsers: totalUsersWithWorkouts,
    };
  } catch (error) {
    console.error("Error fetching user position:", error);
    throw new Error("Failed to fetch user position");
  }
});
