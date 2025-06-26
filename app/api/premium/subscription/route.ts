import { NextResponse } from "next/server";

import { PremiumService } from "@/shared/lib/premium/premium.service";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

/**
 * GET /api/premium/subscription
 *
 * Returns user's subscription details for UI
 */
export async function GET() {
  try {
    const user = await serverRequiredUser();

    const subscription = await PremiumService.getUserSubscription(user.id);

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);

    return NextResponse.json({ isActive: false, error: "Failed to fetch subscription" }, { status: 500 });
  }
}
