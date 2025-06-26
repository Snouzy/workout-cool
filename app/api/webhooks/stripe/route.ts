import { NextRequest, NextResponse } from "next/server";

import { PremiumManager } from "@/shared/lib/premium/premium.manager";

/**
 * POST /api/webhooks/stripe
 * 
 * Handle Stripe webhooks - New Premium System Only
 * Simple, clean implementation without legacy fallbacks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const result = await PremiumManager.processWebhook("stripe", body, signature);
    
    if (result.success) {
      return NextResponse.json({ received: true });
    } else {
      console.error("Webhook processing failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}