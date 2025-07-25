import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { OneRepMaxResponse, StatisticsErrorResponse } from "@/shared/types/statistics.types";
import { prisma } from "@/shared/lib/prisma";
import { PremiumService } from "@/shared/lib/premium/premium.service";
import { STATISTICS_TIMEFRAMES, DEFAULT_TIMEFRAME, TIMEFRAME_DAYS, LOMBARDI_DIVISOR } from "@/shared/constants/statistics";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

const timeframeSchema = z.enum([
  STATISTICS_TIMEFRAMES.FOUR_WEEKS,
  STATISTICS_TIMEFRAMES.EIGHT_WEEKS,
  STATISTICS_TIMEFRAMES.TWELVE_WEEKS,
  STATISTICS_TIMEFRAMES.ONE_YEAR,
]);

// Lombardi formula: 1RM = Weight × (1 + (Reps ÷ 30))
function calculateOneRepMax(weight: number, reps: number): number {
  return weight * (1 + reps / LOMBARDI_DIVISOR);
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

    // Check premium status
    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);

    if (!premiumStatus.isPremium) {
      const errorResponse: StatisticsErrorResponse = {
        error: "PREMIUM_REQUIRED",
        message: "Exercise statistics is a premium feature",
        isPremium: false,
      };
      return NextResponse.json(errorResponse, { status: 403 });
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

    // Fetch sets with weight and reps
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
            types: {
              hasEvery: ["WEIGHT", "REPS"],
            },
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

    // Group by session and calculate best 1RM per session
    const sessionBest1RM = new Map<string, { date: Date; oneRepMax: number }>();

    workoutSessionExercises.forEach((sessionExercise) => {
      const sessionDate = sessionExercise.workoutSession.startedAt.toISOString().split("T")[0];
      let bestOneRepMax = 0;

      sessionExercise.sets.forEach((set) => {
        // Find weight and reps values from arrays
        const weightIndex = set.types.indexOf("WEIGHT");
        const repsIndex = set.types.indexOf("REPS");

        if (weightIndex !== -1 && repsIndex !== -1 && set.valuesInt && set.valuesInt[weightIndex] && set.valuesInt[repsIndex]) {
          const weight = set.valuesInt[weightIndex];
          const reps = set.valuesInt[repsIndex];
          const oneRepMax = calculateOneRepMax(weight, reps);

          if (oneRepMax > bestOneRepMax) {
            bestOneRepMax = oneRepMax;
          }
        }
      });

      if (bestOneRepMax > 0) {
        const currentBest = sessionBest1RM.get(sessionDate);
        if (!currentBest || bestOneRepMax > currentBest.oneRepMax) {
          sessionBest1RM.set(sessionDate, {
            date: sessionExercise.workoutSession.startedAt,
            oneRepMax: Math.round(bestOneRepMax * 10) / 10, // Round to 1 decimal
          });
        }
      }
    });

    // Convert to array format
    const oneRepMaxProgression = Array.from(sessionBest1RM.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ date, oneRepMax }) => ({
        date: date.toISOString(),
        estimatedOneRepMax: oneRepMax,
      }));

    const response: OneRepMaxResponse = {
      exerciseId,
      timeframe,
      formula: "Lombardi",
      formulaDescription: "1RM = Weight × (1 + (Reps ÷ 30))",
      data: oneRepMaxProgression,
      count: oneRepMaxProgression.length,
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
    console.error("Error fetching one-rep max progression:", error);
    const errorResponse: StatisticsErrorResponse = {
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch one-rep max data",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
