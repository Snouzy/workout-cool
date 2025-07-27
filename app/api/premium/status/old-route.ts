import { NextRequest, NextResponse } from "next/server";

import { PremiumService } from "@/shared/lib/premium/premium.service";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

/**
 * GET /api/premium/status
 *
 * Returns user's premium status including RevenueCat information
 * Simple, fast, and reliable
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getMobileCompatibleSession(request);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({
        isPremium: false,
        revenueCatUserId: null,
        hasRevenueCatAccount: false,
      });
    }

    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);
    const revenueCatUserId = await PremiumService.getUserRevenueCatId(user.id);

    return NextResponse.json({
      ...premiumStatus,
      revenueCatUserId,
      hasRevenueCatAccount: !!revenueCatUserId,
    });
  } catch (error) {
    console.error("Error checking premium status:", error);

    // Fail safely - return non-premium if error
    return NextResponse.json(
      {
        isPremium: false,
        revenueCatUserId: null,
        hasRevenueCatAccount: false,
        error: "Failed to check premium status",
      },
      { status: 500 },
    );
  }
}
