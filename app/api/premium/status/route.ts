import { NextResponse } from "next/server";

import { PremiumService } from "@/shared/lib/premium/premium.service";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

/**
 * GET /api/premium/status
 *
 * Returns user's premium status
 * Simple, fast, and reliable
 */
export async function GET() {
  try {
    const user = await serverRequiredUser();

    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);

    return NextResponse.json(premiumStatus);
  } catch (error) {
    console.error("Error checking premium status:", error);

    // Fail safely - return non-premium if error
    return NextResponse.json({ isPremium: false, error: "Failed to check premium status" }, { status: 500 });
  }
}
