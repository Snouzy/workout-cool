import { NextRequest, NextResponse } from "next/server";

import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";
import { StripeProvider } from "@/shared/lib/premium/providers/stripe-provider";

/**
 * POST /api/premium/billing-portal
 *
 * Create Stripe billing portal session for subscription management
 * Body: { returnUrl?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await serverRequiredUser();
    const { returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/profile` } = await request.json();

    const stripeProvider = new StripeProvider();
    const result = await stripeProvider.createBillingPortalSession(user.id, returnUrl);

    if (result.success) {
      return NextResponse.json({ success: true, url: result.url });
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