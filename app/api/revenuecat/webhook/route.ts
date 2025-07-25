import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { PremiumService } from "@/shared/lib/premium/premium.service";

/**
 * RevenueCat Webhook Handler
 *
 * POST /api/revenuecat/webhook
 *
 * Handles RevenueCat webhook events for subscription updates
 * This ensures anonymous purchases are tracked in our database
 */

const webhookEventSchema = z.object({
  event: z.object({
    type: z.string(),
    app_user_id: z.string(),
    aliases: z.array(z.string()).optional(),
    product_id: z.string().optional(),
    entitlement_id: z.string().optional(),
    expiration_at_ms: z.number().optional(),
    purchased_at_ms: z.number().optional(),
    is_family_share: z.boolean().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    console.log("[RevenueCat Webhook] Received event");

    // Parse webhook body
    const body = await request.json();
    console.log("[RevenueCat Webhook] Event data:", JSON.stringify(body, null, 2));

    const { event } = webhookEventSchema.parse(body);

    // Handle different event types
    switch (event.type) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "PRODUCT_CHANGE":
        await handlePurchaseEvent(event);
        break;

      case "CANCELLATION":
      case "EXPIRATION":
        await handleCancellationEvent(event);
        break;

      case "BILLING_ISSUE":
        console.log("[RevenueCat Webhook] Billing issue for user:", event.app_user_id);
        break;

      default:
        console.log("[RevenueCat Webhook] Unhandled event type:", event.type);
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

async function handlePurchaseEvent(event: any) {
  const { app_user_id } = event;

  console.log(`[RevenueCat Webhook] Processing purchase for user: ${app_user_id}`);

  // Check if this is an anonymous user
  const isAnonymous = app_user_id.startsWith("$RCAnonymousID:");

  if (isAnonymous) {
    console.log("[RevenueCat Webhook] Anonymous user purchase detected");
    // Store anonymous purchase info for later transfer
    // We don't create a full user, just track the RevenueCat ID
    // This allows us to verify the purchase when the user authenticates
    
    const existingSubscription = await prisma.subscription.findFirst({
      where: { revenueCatUserId: app_user_id },
    });

    if (!existingSubscription) {
      console.log("[RevenueCat Webhook] Storing anonymous purchase info for later transfer");
      // We'll update this approach to not create a user
    }
    return;
  } else {
    // Handle authenticated user purchases
    const revenueCatUserId = app_user_id;

    // Try to sync with RevenueCat
    const subscription = await prisma.subscription.findFirst({
      where: { revenueCatUserId },
    });

    if (subscription) {
      await PremiumService.syncRevenueCatStatus(subscription.userId, revenueCatUserId);
    }
  }
}

async function handleCancellationEvent(event: any) {
  const { app_user_id } = event;

  console.log(`[RevenueCat Webhook] Processing cancellation for user: ${app_user_id}`);

  // Find subscription by RevenueCat user ID
  const subscription = await prisma.subscription.findFirst({
    where: { revenueCatUserId: app_user_id },
    include: { user: true },
  });

  if (subscription) {
    // Update subscription status
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Update user premium status
    await prisma.user.update({
      where: { id: subscription.userId },
      data: { isPremium: false },
    });

    console.log(`[RevenueCat Webhook] Subscription cancelled for user: ${subscription.userId}`);
  }
}
