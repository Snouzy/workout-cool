"use server";

import { z } from "zod";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";
import { TopWorkoutUser } from "@/features/leaderboard/models/types";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const LIMIT_TOP_USERS = 20;
const PARIS_TZ = "Europe/Paris";

export type LeaderboardPeriod = "all-time" | "weekly" | "monthly";

const inputSchema = z.object({
  period: z.enum(["all-time", "weekly", "monthly"]).default("all-time"),
});

function getDateRangeForPeriod(period: LeaderboardPeriod): { startDate: Date | undefined; endDate: Date } {
  const now = dayjs().tz(PARIS_TZ);

  switch (period) {
    case "weekly": {
      // Start of current week (Monday) in Paris timezone
      const startOfWeek = now.startOf("week").add(1, "day"); // dayjs week starts on Sunday, add 1 for Monday
      return {
        startDate: startOfWeek.toDate(),
        endDate: now.toDate(),
      };
    }
    case "monthly": {
      // Start of current month in Paris timezone
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

export const getTopWorkoutUsersAction = actionClient.schema(inputSchema).action(async ({ parsedInput }) => {
  const { period } = parsedInput;

  try {
    const { startDate, endDate } = getDateRangeForPeriod(period);

    const whereClause = {
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
    };

    const topUsers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
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
        WorkoutSession: {
          where: startDate
            ? {
                startedAt: {
                  gte: startDate,
                  lte: endDate,
                },
              }
            : undefined,
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
