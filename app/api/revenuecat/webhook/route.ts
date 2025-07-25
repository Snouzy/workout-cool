/* eslint-disable @typescript-eslint/naming-convention */
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
      case "SUBSCRIPTION_PAUSED":
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
  const { app_user_id, product_id, entitlement_id, purchased_at_ms } = event;

  console.log(`[RevenueCat Webhook] Processing purchase for user: ${app_user_id}`);

  // Check if this is an anonymous user
  const isAnonymous = app_user_id.startsWith("$RCAnonymousID:");

  if (isAnonymous) {
    console.log("[RevenueCat Webhook] Anonymous user purchase detected");

    // Store the webhook event for later processing when user authenticates
    await prisma.revenueCatWebhookEvent.create({
      data: {
        eventType: event.type,
        eventTimestamp: new Date(purchased_at_ms || Date.now()),
        appUserId: app_user_id,
        environment: "PRODUCTION", // Adjust based on your webhook configuration
        productId: product_id,
        entitlementIds: entitlement_id ? JSON.stringify([entitlement_id]) : null,
        rawEventData: event,
        processed: false, // Will be processed when user authenticates
      },
    });

    console.log("[RevenueCat Webhook] Stored anonymous purchase event for later processing");
    return;
  }

  // Handle authenticated user purchases
  console.log(`[RevenueCat Webhook] Processing purchase for authenticated user: ${app_user_id}`);

  // Find user by their authenticated ID (not RevenueCat ID)
  const user = await prisma.user.findUnique({
    where: { id: app_user_id },
  });

  if (!user) {
    console.log(`[RevenueCat Webhook] User not found for ID: ${app_user_id}`);
    return;
  }

  // Sync the purchase status
  await PremiumService.syncRevenueCatStatus(user.id, app_user_id);

  // Mark any pending anonymous events as processed
  await prisma.revenueCatWebhookEvent.updateMany({
    where: {
      appUserId: app_user_id,
      processed: false,
    },
    data: {
      processed: true,
      updatedAt: new Date(),
    },
  });
}

async function handleCancellationEvent(event: any) {
  const { app_user_id, type } = event;

  console.log(`[RevenueCat Webhook] Processing ${type} for user: ${app_user_id}`);

  // Check if this is an anonymous user
  const isAnonymous = app_user_id.startsWith("$RCAnonymousID:");

  if (isAnonymous) {
    console.log(`[RevenueCat Webhook] Anonymous user ${type} - storing event`);

    // Store the cancellation/expiration event
    await prisma.revenueCatWebhookEvent.create({
      data: {
        eventType: event.type,
        eventTimestamp: new Date(),
        appUserId: app_user_id,
        environment: "PRODUCTION",
        rawEventData: event,
        processed: false,
      },
    });
    return;
  }

  // Handle authenticated user cancellation/expiration
  const user = await prisma.user.findUnique({
    where: { id: app_user_id },
  });

  if (user) {
    console.log(`[RevenueCat Webhook] Processing ${type} for authenticated user: ${user.id}`);

    // Sync with RevenueCat to get current status
    // This will update the user's premium status based on current entitlements
    await PremiumService.syncRevenueCatStatus(user.id, app_user_id);

    console.log(`[RevenueCat Webhook] ${type} processed for user: ${user.id}`);
  } else {
    console.log(`[RevenueCat Webhook] User not found for ${type} event: ${app_user_id}`);
  }
}
