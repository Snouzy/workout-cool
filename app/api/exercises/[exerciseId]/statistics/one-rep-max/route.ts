import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { OneRepMaxResponse, StatisticsErrorResponse } from "@/shared/types/statistics.types";
import { STATISTICS_TIMEFRAMES, DEFAULT_TIMEFRAME } from "@/shared/constants/statistics";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

const timeframeSchema = z.enum([
  STATISTICS_TIMEFRAMES.FOUR_WEEKS,
  STATISTICS_TIMEFRAMES.EIGHT_WEEKS,
  STATISTICS_TIMEFRAMES.TWELVE_WEEKS,
  STATISTICS_TIMEFRAMES.ONE_YEAR,
]);

/**
 * One-Rep Max endpoint - Not applicable for calisthenics exercises.
 * This endpoint returns an empty dataset as calisthenics exercises are bodyweight-based
 * and don't have a meaningful 1RM calculation.
 *
 * For calisthenics progression tracking, use the weight-progression endpoint
 * which now tracks max reps/hold time instead.
 */
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
    const { exerciseId } = await params;

    // One-Rep Max is not applicable for calisthenics exercises
    // Return empty dataset with explanation
    const response: OneRepMaxResponse = {
      exerciseId,
      timeframe,
      formula: "N/A",
      formulaDescription: "One-Rep Max is not applicable for calisthenics/bodyweight exercises",
      data: [],
      count: 0,
    };

    // Add cache headers
    const headers = new Headers();
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

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
