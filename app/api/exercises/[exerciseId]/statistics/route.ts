import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { ExerciseStatisticsResponse, StatisticsErrorResponse } from "@/shared/types/statistics.types";
import { PremiumService } from "@/shared/lib/premium/premium.service";
import { STATISTICS_TIMEFRAMES, DEFAULT_TIMEFRAME } from "@/shared/constants/statistics";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

const timeframeSchema = z.enum([
  STATISTICS_TIMEFRAMES.FOUR_WEEKS,
  STATISTICS_TIMEFRAMES.EIGHT_WEEKS,
  STATISTICS_TIMEFRAMES.TWELVE_WEEKS,
  STATISTICS_TIMEFRAMES.ONE_YEAR,
]);

const statisticsParamsSchema = z.object({
  exerciseId: z.string(),
  timeframe: timeframeSchema.optional().default(DEFAULT_TIMEFRAME),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    // Get user session
    const session = await getMobileCompatibleSession(request);
    const user = session?.user;

    if (!user) {
      const errorResponse: StatisticsErrorResponse = { 
        error: "UNAUTHORIZED", 
        message: "Authentication required" 
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Check premium status
    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);
    
    if (!premiumStatus.isPremium) {
      const errorResponse: StatisticsErrorResponse = { 
        error: "PREMIUM_REQUIRED", 
        message: "Exercise statistics is a premium feature",
        isPremium: false 
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    const { exerciseId } = await params;

    // Parse and validate parameters
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || DEFAULT_TIMEFRAME;

    const parsed = statisticsParamsSchema.safeParse({
      exerciseId,
      timeframe,
    });

    if (!parsed.success) {
      const errorResponse: StatisticsErrorResponse = { 
        error: "INVALID_PARAMETERS", 
        message: "Invalid request parameters",
        details: parsed.error.format() 
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // TODO: Implement actual statistics fetching
    // This is a placeholder response structure
    const response: ExerciseStatisticsResponse = {
      exerciseId: parsed.data.exerciseId,
      timeframe: parsed.data.timeframe,
      statistics: {
        weightProgression: [],
        estimatedOneRepMax: [],
        volume: [],
      },
    };
    
    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching exercise statistics:", error);
    const errorResponse: StatisticsErrorResponse = { 
      error: "INTERNAL_SERVER_ERROR", 
      message: "Failed to fetch statistics" 
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}