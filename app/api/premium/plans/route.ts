import { NextRequest, NextResponse } from "next/server";

import { PremiumManager } from "@/shared/lib/premium/premium.manager";

/**
 * GET /api/premium/plans
 *
 * Get available premium plans with optional provider/region filtering
 * Query params: provider, region
 * Public endpoint - no auth required
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider") || undefined;
    const region = searchParams.get("region") || undefined;

    const plans = await PremiumManager.getAvailablePlans(provider, region);
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);

    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
