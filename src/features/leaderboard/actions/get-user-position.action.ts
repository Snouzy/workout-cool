"use server";

import { z } from "zod";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";

import { LeaderboardPeriod } from "./get-top-workout-users.action";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const PARIS_TZ = "Europe/Paris";

const inputSchema = z.object({
  userId: z.string(),
  period: z.enum(["all-time", "weekly", "monthly"]).default("all-time"),
});

function getDateRangeForPeriod(period: LeaderboardPeriod): { startDate: Date | undefined; endDate: Date } {
  const now = dayjs().tz(PARIS_TZ);

  switch (period) {
    case "weekly": {
      const startOfWeek = now.startOf("week").add(1, "day");
      return {
        startDate: startOfWeek.toDate(),
        endDate: now.toDate(),
      };
    }
    case "monthly": {
      const startOfMonth = now.startOf("month");
      return {
        startDate: startOfMonth.toDate(),
        endDate: now.toDate(),
      };
    }
    case "all-time":
    default:
      return {
        startDate: undefined,
        endDate: now.toDate(),
      };
  }
}

export const getUserPositionAction = actionClient.schema(inputSchema).action(async ({ parsedInput }) => {
  const { userId, period } = parsedInput;

  try {
    const { startDate, endDate } = getDateRangeForPeriod(period);

    // Get user's workout count
    const userWorkoutCount = await prisma.workoutSession.count({
      where: {
        userId,
        ...(startDate && {
          startedAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
    });

    // Calculate real position
    const totalUsersWithWorkouts = await prisma.user.count({
      where: {
        WorkoutSession: {
          some: startDate
            ? {
                startedAt: {
                  gte: startDate,
                  lte: endDate,
                },
              }
            : {},
        },
      },
    });

    // Get all users sorted by workout count to find exact position
    const allUsers = await prisma.user.findMany({
      where: {
        WorkoutSession: {
          some: startDate
            ? {
                startedAt: {
                  gte: startDate,
                  lte: endDate,
                },
              }
            : {},
        },
      },
      select: {
        id: true,
        _count: {
          select: {
            WorkoutSession: startDate
              ? {
                  where: {
                    startedAt: {
                      gte: startDate,
                      lte: endDate,
                    },
                  },
                }
              : true,
          },
        },
      },
      orderBy: {
        WorkoutSession: {
          _count: "desc",
        },
      },
    });

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
