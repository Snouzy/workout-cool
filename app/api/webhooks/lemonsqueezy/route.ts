import crypto from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { webhookService } from "@/features/billing/model/webhook.service";

import type { LemonSqueezyWebhookPayload } from "@/features/billing/model/billing.types";

// ⚠️ Just in case we get rejected or blocked by STRIPE.

// Verify LemonSqueezy signature
function verifyLemonSqueezySignature(payload: string, signature: string): boolean {
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
    return false;
  }

  // LemonSqueezy uses HMAC SHA256
  const hash = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");

  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    // Get body and signature
    const body = await request.text();
    const signature = request.headers.get("X-Signature") || "";

    // Verify signature
    if (!verifyLemonSqueezySignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: LemonSqueezyWebhookPayload = JSON.parse(body);

    // Log webhook for asynchronous processing
    const webhookEvent = await webhookService.logWebhook(
      "LEMONSQUEEZY",
      payload.meta.event_name,
      payload,
      undefined, // headers stored in payload if necessary
      // Extract user ID if available in payload
      payload.data.attributes?.user_email,
    );

    // Process webhook immediately (or in background)
    await webhookService.processWebhook(webhookEvent.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LemonSqueezy webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
