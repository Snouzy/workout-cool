import { NextRequest, NextResponse } from "next/server";

/**
 * DEPRECATED: This endpoint is no longer needed
 *
 * RevenueCat handles user linking automatically when using logIn():
 * - Anonymous purchases are automatically transferred to authenticated users
 * - No manual linking is required
 *
 * The sync is handled by the /api/revenuecat/sync-status endpoint
 */

export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. RevenueCat handles user linking automatically via logIn()",
    },
    { status: 410 }, // 410 Gone
  );
}

/**
 * Get Premium Status
 *
 * GET /api/revenuecat/link-user
 *
 * Gets the current user's premium status
 * This endpoint is kept for backward compatibility
 */
export async function GET(request: NextRequest) {
  try {
    const { getMobileCompatibleSession } = await import("@/shared/api/mobile-auth");
    const { PremiumService } = await import("@/shared/lib/premium/premium.service");

    // Get authenticated user
    const session = await getMobileCompatibleSession(request);
    const user = session?.user;

    if (!user) {
      console.log("No user found");
      return NextResponse.json({
        premiumStatus: {
          isPremium: false,
        },
      });
    }

    // Get premium status
    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);

    return NextResponse.json({
      premiumStatus,
    });
  } catch (error) {
    console.error("Error getting premium status:", error);

    return NextResponse.json({ error: "Failed to get premium status" }, { status: 500 });
  }
}
