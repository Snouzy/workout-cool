"use server";

import { z } from "zod";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";

dayjs.extend(utc);
dayjs.extend(timezone);

const getWorkoutStreaksSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(10),
  timeZone: z.string().optional().default("UTC"),
});

export interface UserWorkoutStreak {
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  lastWorkoutAt: Date | null;
}

export const getWorkoutStreaksAction = actionClient.schema(getWorkoutStreaksSchema).action(async ({ parsedInput }) => {
  try {
    const { limit, timeZone } = parsedInput;

    // Get all users with their workout sessions
    const usersWithWorkouts = await prisma.user.findMany({
      include: {
        WorkoutSession: {
          where: {
            endedAt: {
              not: null,
            },
          },
          orderBy: {
            endedAt: "desc",
          },
        },
      },
      where: {
        WorkoutSession: {
          some: {
            endedAt: {
              not: null,
            },
          },
        },
      },
    });

    // Calculate streaks for each user
    const userStreaks: UserWorkoutStreak[] = usersWithWorkouts.map((user) => {
      const sessions = user.WorkoutSession;

      if (sessions.length === 0) {
        return {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userImage: user.image,
          currentStreak: 0,
          longestStreak: 0,
          totalWorkouts: 0,
          lastWorkoutAt: null,
        };
      }

      // Group sessions by date in user's timezone
      const sessionsByDate = new Map<string, Date>();
      sessions.forEach((session) => {
        if (session.endedAt) {
          try {
            const sessionDate = dayjs(session.endedAt).tz(timeZone).format("YYYY-MM-DD");
            if (!sessionsByDate.has(sessionDate) || sessionsByDate.get(sessionDate)! < session.endedAt) {
              sessionsByDate.set(sessionDate, session.endedAt);
            }
          } catch (error) {
            console.warn("Error processing session date:", error);
          }
        }
      });

      const workoutDates = Array.from(sessionsByDate.keys()).sort().reverse();

      // Calculate current streak
      let currentStreak = 0;
      const today = dayjs().tz(timeZone);
      
      for (let i = 0; i < workoutDates.length; i++) {
        const workoutDate = dayjs(workoutDates[i]).tz(timeZone);
        const expectedDate = today.subtract(i, "day");
        
        if (workoutDate.isSame(expectedDate, "day")) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      
      for (let i = 0; i < workoutDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const currentDate = dayjs(workoutDates[i]).tz(timeZone);
          const previousDate = dayjs(workoutDates[i - 1]).tz(timeZone);
          
          if (previousDate.diff(currentDate, "day") === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        currentStreak,
        longestStreak,
        totalWorkouts: sessions.length,
        lastWorkoutAt: sessions[0]?.endedAt || null,
      };
    });

    // Sort by current streak (descending), then by longest streak, then by total workouts
    const sortedStreaks = userStreaks
      .sort((a, b) => {
        if (a.currentStreak !== b.currentStreak) {
          return b.currentStreak - a.currentStreak;
        }
        if (a.longestStreak !== b.longestStreak) {
          return b.longestStreak - a.longestStreak;
        }
        return b.totalWorkouts - a.totalWorkouts;
      })
      .slice(0, limit);

    return { userStreaks: sortedStreaks };
  } catch (error) {
    console.error("Error fetching workout streaks:", error);
    return { serverError: "Failed to fetch workout streaks" };
  }
});