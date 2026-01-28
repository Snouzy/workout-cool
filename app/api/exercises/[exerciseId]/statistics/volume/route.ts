import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { VolumeResponse, StatisticsErrorResponse } from "@/shared/types/statistics.types";
import { prisma } from "@/shared/lib/prisma";
import { STATISTICS_TIMEFRAMES, DEFAULT_TIMEFRAME, TIMEFRAME_DAYS } from "@/shared/constants/statistics";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

const timeframeSchema = z.enum([
  STATISTICS_TIMEFRAMES.FOUR_WEEKS,
  STATISTICS_TIMEFRAMES.EIGHT_WEEKS,
  STATISTICS_TIMEFRAMES.TWELVE_WEEKS,
  STATISTICS_TIMEFRAMES.ONE_YEAR,
]);

// Get week number from date
function getWeekNumber(date: Date): string {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  const weekNumber = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${tempDate.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
}

// Get week start date (Monday)
function getWeekStartDate(date: Date): Date {
  const tempDate = new Date(date);
  const day = tempDate.getDay();
  const diff = tempDate.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(tempDate.setDate(diff));
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) {
  try {
    // Get user session
    const session = await getMobileCompatibleSession(request);
    const user = session?.user;

    if (!user) {
      const errorResponse: StatisticsErrorResponse = {
        error: "UNAUTHORIZED",
        message: "Authentication required",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Parse timeframe
    const { searchParams } = new URL(request.url);
    const timeframeRaw = searchParams.get("timeframe") || DEFAULT_TIMEFRAME;

    const timeframeParsed = timeframeSchema.safeParse(timeframeRaw);
    if (!timeframeParsed.success) {
      const errorResponse: StatisticsErrorResponse = {
        error: "INVALID_PARAMETERS",
        message: "Invalid timeframe parameter",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const timeframe = timeframeParsed.data;

    // Calculate date range (ensuring we're working with UTC dates to avoid timezone issues)
    const endDate = new Date();
    const startDate = new Date();

    const daysToSubtract = TIMEFRAME_DAYS[timeframe];
    if (timeframe === STATISTICS_TIMEFRAMES.ONE_YEAR) {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      startDate.setDate(startDate.getDate() - daysToSubtract);
    }

    // Set time to start and end of day in UTC
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const { exerciseId } = await params;

    // Fetch all sets for volume calculation
    const workoutSessionExercises = await prisma.workoutSessionExercise.findMany({
      where: {
        exerciseId,
        workoutSession: {
          userId: user.id,
          startedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        workoutSession: {
          select: {
            startedAt: true,
          },
        },
        sets: {
          where: {
            completed: true,
          },
          orderBy: {
            setIndex: "asc",
          },
        },
      },
      orderBy: {
        workoutSession: {
          startedAt: "asc",
        },
      },
    });

    // Calculate weekly volume for calisthenics
    const weeklyVolume = new Map<string, { weekStart: Date; totalVolume: number; setCount: number }>();

    workoutSessionExercises.forEach((sessionExercise) => {
      const weekKey = getWeekNumber(sessionExercise.workoutSession.startedAt);
      const weekStart = getWeekStartDate(sessionExercise.workoutSession.startedAt);

      sessionExercise.sets.forEach((set) => {
        let volume = 0;

        // Calculate volume based on set data (calisthenics-focused)
        if (set.reps) {
          // Rep-based exercise: count reps as volume
          volume = set.reps;
        } else if (set.holdTimeSeconds) {
          // Time-based exercise: use seconds as volume
          volume = set.holdTimeSeconds;
        }

        if (volume > 0) {
          const currentWeek = weeklyVolume.get(weekKey) || { weekStart, totalVolume: 0, setCount: 0 };
          weeklyVolume.set(weekKey, {
            weekStart,
            totalVolume: currentWeek.totalVolume + volume,
            setCount: currentWeek.setCount + 1,
          });
        }
      });
    });

    // Convert to array format
    const volumeProgression = Array.from(weeklyVolume.entries())
      .sort(([, a], [, b]) => a.weekStart.getTime() - b.weekStart.getTime())
      .map(([week, data]) => ({
        week,
        weekStart: data.weekStart.toISOString(),
        totalVolume: Math.round(data.totalVolume),
        setCount: data.setCount,
      }));

    const response: VolumeResponse = {
      exerciseId,
      timeframe,
      data: volumeProgression,
      count: volumeProgression.length,
      calculationNote: "Volume = total reps (for rep-based) or total seconds (for time-based exercises)",
    };

    // Add cache headers - 1 hour cache (disabled for debugging)
    const headers = new Headers();
    // Temporarily disable cache for debugging
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    // Original: headers.set("Cache-Control", "private, max-age=3600, stale-while-revalidate=86400");

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error("Error fetching volume data:", error);
    const errorResponse: StatisticsErrorResponse = {
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch volume data",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
