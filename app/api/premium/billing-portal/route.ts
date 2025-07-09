import { NextRequest, NextResponse } from "next/server";

import { PremiumManager } from "@/shared/lib/premium/premium.manager";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

/**
 * POST /api/premium/billing-portal
 *
 * Create billing portal session for subscription management
 * Body: { returnUrl?: string, provider?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await serverRequiredUser();
    const { returnUrl, provider = "stripe" } = await request.json();

    const result = await PremiumManager.createBillingPortal(user.id, provider, returnUrl);

    if (result.success) {
      return NextResponse.json({ success: true, url: result.checkoutUrl });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Billing portal creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create billing portal session",
      },
      { status: 500 },
    );
  }
}
