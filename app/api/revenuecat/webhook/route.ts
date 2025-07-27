import crypto from "crypto";

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Platform } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

/**
 * RevenueCat Webhook Handler
 *
 * POST /api/revenuecat/webhook
 *
 * Handles RevenueCat webhook events for subscription status changes.
 * Events: https://www.revenuecat.com/docs/webhooks
 */

// RevenueCat webhook event schema
const webhookEventSchema = z.object({
  api_version: z.string(),
  event: z.object({
    app_user_id: z.string(),
    aliases: z.array(z.string()).optional(),
    country_code: z.string().optional(),
    currency: z.string().optional(),
    entitlement_id: z.string().optional(),
    entitlement_ids: z.array(z.string()).optional(),
    environment: z.enum(["SANDBOX", "PRODUCTION"]),
    event_timestamp_ms: z.number(),
    expiration_at_ms: z.number().optional(),
    id: z.string(),
    is_family_share: z.boolean().optional(),
    offer_code: z.string().optional().nullable(),
    original_app_user_id: z.string(),
    original_transaction_id: z.string().optional(),
    period_type: z.string().optional(),
    presented_offering_id: z.string().optional().nullable(),
    price: z.number().optional(),
    price_in_purchased_currency: z.number().optional(),
    product_id: z.string(),
    purchased_at_ms: z.number().optional(),
    store: z.enum(["APP_STORE", "MAC_APP_STORE", "PLAY_STORE", "STRIPE", "PROMOTIONAL", "UNKNOWN"]),
    subscriber_attributes: z.record(z.any()).optional(),
    takehome_percentage: z.number().optional(),
    tax_percentage: z.number().optional(),
    transaction_id: z.string().optional(),
    type: z.string(),
  }),
});

// Verify webhook signature
function verifyWebhookSignature(request: Request, body: string, secret: string): boolean {
  const signature = request.headers.get("X-RevenueCat-Signature");
  if (!signature) {
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const expectedSignature = hmac.digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"));
}

export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[RevenueCat Webhook] No webhook secret configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(request, rawBody, webhookSecret)) {
      console.error("[RevenueCat Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse webhook event
    const body = JSON.parse(rawBody);
    const webhookEvent = webhookEventSchema.parse(body);
    const { event } = webhookEvent;

    console.log(`[RevenueCat Webhook] Received event: ${event.type} for user: ${event.app_user_id}`);

    // Handle different event types
    switch (event.type) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "UNCANCELLATION":
        await handleSubscriptionActive(event);
        break;

      case "CANCELLATION":
      case "EXPIRATION":
        await handleSubscriptionInactive(event);
        break;

      case "BILLING_ISSUE":
        await handleBillingIssue(event);
        break;

      case "PRODUCT_CHANGE":
        await handleProductChange(event);
        break;

      default:
        console.log(`[RevenueCat Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RevenueCat Webhook] Error processing webhook:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid webhook data", details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

// Handle subscription becoming active
async function handleSubscriptionActive(event: z.infer<typeof webhookEventSchema>["event"]) {
  const userId = event.app_user_id;
  const expirationDate = event.expiration_at_ms ? new Date(event.expiration_at_ms) : null;

  // Update user premium status
  await prisma.user.update({
    where: { id: userId },
    data: { isPremium: true },
  });

  // Update or create subscription record
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId_platform: {
        userId,
        platform: Platform.ANDROID || Platform.IOS,
      },
    },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        currentPeriodEnd: expirationDate,
        revenueCatUserId: event.original_app_user_id,
        updatedAt: new Date(),
      },
    });
  } else {
    // Find a default plan
    const plan = await prisma.subscriptionPlan.findFirst({
      where: { isActive: true },
    });

    if (plan) {
      await prisma.subscription.create({
        data: {
          userId,
          planId: plan.id,
          revenueCatUserId: event.original_app_user_id,
          status: "ACTIVE",
          platform: Platform.ANDROID || Platform.IOS,
          startedAt: new Date(event.purchased_at_ms || Date.now()),
          currentPeriodEnd: expirationDate,
        },
      });
    }
  }
}

// Handle subscription becoming inactive
async function handleSubscriptionInactive(event: z.infer<typeof webhookEventSchema>["event"]) {
  const userId = event.app_user_id;

  // Update user premium status
  await prisma.user.update({
    where: { id: userId },
    data: { isPremium: false },
  });

  // Update subscription status
  await prisma.subscription.updateMany({
    where: {
      userId,
      platform: Platform.ANDROID || Platform.IOS,
      status: "ACTIVE",
    },
    data: {
      status: event.type === "CANCELLATION" ? "CANCELLED" : "EXPIRED",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

// Handle billing issues
async function handleBillingIssue(event: z.infer<typeof webhookEventSchema>["event"]) {
  const userId = event.app_user_id;

  // Update subscription status to indicate billing issue
  await prisma.subscription.updateMany({
    where: {
      userId,
      platform: Platform.ANDROID || Platform.IOS,
      status: "ACTIVE",
    },
    data: {
      status: "EXPIRED",
      updatedAt: new Date(),
    },
  });
}

// Handle product changes
async function handleProductChange(event: z.infer<typeof webhookEventSchema>["event"]) {
  const userId = event.app_user_id;

  // For now, just update the expiration date
  // In a more complex system, you might update the plan as well
  const expirationDate = event.expiration_at_ms ? new Date(event.expiration_at_ms) : null;

  await prisma.subscription.updateMany({
    where: {
      userId,
      platform: Platform.ANDROID || Platform.IOS,
      status: "ACTIVE",
    },
    data: {
      currentPeriodEnd: expirationDate,
      updatedAt: new Date(),
    },
  });
}
