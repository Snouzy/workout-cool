import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { WeightProgressionResponse, StatisticsErrorResponse } from "@/shared/types/statistics.types";
import { prisma } from "@/shared/lib/prisma";
import { STATISTICS_TIMEFRAMES, DEFAULT_TIMEFRAME, TIMEFRAME_DAYS } from "@/shared/constants/statistics";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

const timeframeSchema = z.enum([
  STATISTICS_TIMEFRAMES.FOUR_WEEKS,
  STATISTICS_TIMEFRAMES.EIGHT_WEEKS,
  STATISTICS_TIMEFRAMES.TWELVE_WEEKS,
  STATISTICS_TIMEFRAMES.ONE_YEAR,
]);

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

    // Fetch progression data (calisthenics-focused: max reps or hold time)
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

    // Group by session and find max reps or hold time per session
    const sessionMaxValues = new Map<string, { date: Date; maxValue: number }>();

    workoutSessionExercises.forEach((sessionExercise) => {
      const sessionDate = sessionExercise.workoutSession.startedAt.toISOString().split("T")[0];
      let maxValue = 0;

      sessionExercise.sets.forEach((set) => {
        // For calisthenics, track max reps or max hold time
        const value = set.reps ?? set.holdTimeSeconds ?? 0;
        if (value > maxValue) {
          maxValue = value;
        }
      });

      if (maxValue > 0) {
        const currentMax = sessionMaxValues.get(sessionDate);
        if (!currentMax || maxValue > currentMax.maxValue) {
          sessionMaxValues.set(sessionDate, {
            date: sessionExercise.workoutSession.startedAt,
            maxValue: maxValue,
          });
        }
      }
    });

    // Convert to array format (reusing WeightProgressionResponse structure for compatibility)
    const progression = Array.from(sessionMaxValues.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ date, maxValue }) => ({
        date: date.toISOString(),
        weight: maxValue, // Reusing 'weight' field to store max reps/hold time for API compatibility
      }));

    const response: WeightProgressionResponse = {
      exerciseId,
      timeframe,
      data: progression,
      count: progression.length,
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
    console.error("Error fetching progression:", error);
    const errorResponse: StatisticsErrorResponse = {
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch progression data",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
