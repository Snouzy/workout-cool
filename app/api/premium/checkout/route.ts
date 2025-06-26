import { NextRequest, NextResponse } from "next/server";

import { PremiumManager } from "@/shared/lib/premium/premium.manager";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

/**
 * POST /api/premium/checkout
 *
 * Create checkout session for premium subscription
 * Body: { planId: string, provider?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await serverRequiredUser();

    const { planId, provider = "stripe" } = await request.json();

    if (!planId) {
      return NextResponse.json({ success: false, error: "Plan ID is required" }, { status: 400 });
    }

    const result = await PremiumManager.createCheckout(user.id, planId, provider);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkout creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create checkout session",
        provider: "stripe",
      },
      { status: 500 },
    );
  }
}
