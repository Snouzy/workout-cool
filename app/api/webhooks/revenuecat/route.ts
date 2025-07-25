/* eslint-disable no-case-declarations */

import { NextRequest, NextResponse } from "next/server";

import { RevenueCatMapping } from "@/shared/lib/revenuecat/revenuecat.mapping";
import { RevenueCatConfig } from "@/shared/lib/revenuecat/revenuecat.config";
import { prisma } from "@/shared/lib/prisma";

/**
 * RevenueCat Webhook Handler
 *
 * Processes RevenueCat webhook events for subscription lifecycle management
 * Follows security best practices with signature validation
 */

interface RevenueCatWebhookEvent {
  event: {
    type: string;
    event_timestamp_ms: number;
    app_user_id: string;
    original_app_user_id?: string;
    aliases?: string[];
    product_id?: string;
    period_type?: "NORMAL" | "TRIAL" | "INTRO";
    purchased_at?: number;
    expiration_at_ms?: number;
    environment: "SANDBOX" | "PRODUCTION";
    entitlement_id?: string;
    entitlement_ids?: string[];
    price?: number;
    currency?: string;
    is_family_share?: boolean;
    country_code?: string;
    app_id: string;
    offer_code?: string;
    takehome_percentage?: number;
    transaction_id?: string;
    original_transaction_id?: string;
    is_renewal?: boolean;
    cancel_reason?: string;
    grace_period_expiration_at?: number;
    auto_resume_at?: number;
    store?: "APP_STORE" | "MAC_APP_STORE" | "PLAY_STORE" | "STRIPE" | "PROMOTIONAL";
  };
}

/**
 * Verify RevenueCat webhook authorization header
 * RevenueCat uses a simple authorization header verification, not HMAC signatures
 */
function verifyWebhookAuthorization(authHeader: string, expectedSecret: string): boolean {
  try {
    // RevenueCat sends the authorization header as "Bearer <your_secret>"
    const receivedSecret = authHeader.replace("Bearer ", "");
    return receivedSecret === expectedSecret;
  } catch (error) {
    console.error("Error verifying webhook authorization:", error);
    return false;
  }
}

/**
 * Log webhook event for debugging and monitoring
 */
async function logWebhookEvent(event: RevenueCatWebhookEvent, success: boolean, processingError?: string) {
  console.log("event:", event);
  try {
    await prisma.revenueCatWebhookEvent.create({
      data: {
        eventType: event.event.type,
        eventTimestamp: new Date(event.event.event_timestamp_ms),
        appUserId: event.event.app_user_id,
        environment: event.event.environment,
        productId: event.event.product_id,
        transactionId: event.event.transaction_id,
        originalTransactionId: event.event.original_transaction_id,
        entitlementIds: event.event.entitlement_ids ? JSON.stringify(event.event.entitlement_ids) : null,
        processed: success,
        processingError: processingError,
        rawEventData: JSON.stringify(event),
      },
    });

    // Also log to console in development
    if (RevenueCatConfig.isDevelopment()) {
      console.log("RevenueCat webhook event:", {
        type: event.event.type,
        appUserId: event.event.app_user_id,
        environment: event.event.environment,
        success,
        timestamp: new Date(event.event.event_timestamp_ms * 1000).toISOString(),
      });
    }
  } catch (error) {
    console.error("Failed to log webhook event:", error);
  }
}

/**
 * Process subscription events
 */
async function processSubscriptionEvent(webhook: RevenueCatWebhookEvent) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { type, app_user_id, entitlement_ids, expiration_at_ms, product_id, transaction_id, original_transaction_id } = webhook.event;

  // Find user by RevenueCat user ID
  const user = await prisma.user.findFirst({
    where: {
      subscriptions: {
        some: {
          revenueCatUserId: app_user_id,
        },
      },
    },
    include: {
      subscriptions: true,
    },
  });

  if (!user) {
    console.warn(`User not found for RevenueCat user ID: ${app_user_id}`);
    return;
  }

  // Validate product ID if provided
  if (product_id) {
    const isValidProduct = await RevenueCatMapping.validateProductId(product_id);
    if (!isValidProduct) {
      console.warn(`Unknown RevenueCat product ID: ${product_id}`);
      // Continue processing but log the warning
    }
  }

  const expirationDate = expiration_at_ms ? new Date(expiration_at_ms) : null;

  switch (type) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "PRODUCT_CHANGE":
      // Grant premium access
      await prisma.user.update({
        where: { id: user.id },
        data: { isPremium: true },
      });

      // Update subscription record
      await prisma.subscription.updateMany({
        where: {
          userId: user.id,
          revenueCatUserId: app_user_id,
        },
        data: {
          status: "ACTIVE",
          currentPeriodEnd: expirationDate,
          revenueCatEntitlement: entitlement_ids?.join(","),
          revenueCatTransactionId: original_transaction_id || transaction_id,
          revenueCatProductId: product_id,
          updatedAt: new Date(),
        },
      });
      break;

    case "CANCELLATION":
    case "EXPIRATION":
    case "BILLING_ISSUE":
      // Check if user has other active subscriptions
      const otherActiveSubscriptions = await prisma.subscription.count({
        where: {
          userId: user.id,
          status: "ACTIVE",
          revenueCatUserId: { not: app_user_id },
        },
      });

      // Only revoke premium if no other active subscriptions
      if (otherActiveSubscriptions === 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isPremium: false },
        });
      }

      // Update subscription status
      await prisma.subscription.updateMany({
        where: {
          userId: user.id,
          revenueCatUserId: app_user_id,
        },
        data: {
          status: type === "CANCELLATION" ? "CANCELLED" : "EXPIRED",
          cancelledAt: type === "CANCELLATION" ? new Date() : null,
          updatedAt: new Date(),
        },
      });
      break;

    case "UNCANCELLATION":
      // Restore premium access
      await prisma.user.update({
        where: { id: user.id },
        data: { isPremium: true },
      });

      await prisma.subscription.updateMany({
        where: {
          userId: user.id,
          revenueCatUserId: app_user_id,
        },
        data: {
          status: "ACTIVE",
          cancelledAt: null,
          updatedAt: new Date(),
        },
      });
      break;

    default:
      console.log(`Unhandled RevenueCat event type: ${type}`);
  }
}

/**
 * POST /api/webhooks/revenuecat
 *
 * Handle RevenueCat webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Check if RevenueCat is configured
    if (!RevenueCatConfig.isConfigured()) {
      console.warn("RevenueCat webhook received but not configured");
      console.log(RevenueCatConfig.getWebhookConfig());
      return NextResponse.json({ error: "RevenueCat not configured" }, { status: 503 });
    }

    // Get raw body and authorization header
    const body = await request.text();
    const authHeader = request.headers.get("Authorization") || "";

    // Verify webhook authorization
    const webhookConfig = RevenueCatConfig.getWebhookConfig();
    const isValidAuth = verifyWebhookAuthorization(authHeader, webhookConfig.secret);

    if (!isValidAuth) {
      console.error("Invalid RevenueCat webhook authorization");
      return NextResponse.json({ error: "Invalid authorization" }, { status: 401 });
    }

    // Parse webhook event
    const event: RevenueCatWebhookEvent = JSON.parse(body);

    // Log event for monitoring
    await logWebhookEvent(event, true);

    // Process subscription event
    await processSubscriptionEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("RevenueCat webhook error:", error);

    // Log failed event
    try {
      const body = await request.text();
      const event: RevenueCatWebhookEvent = JSON.parse(body);
      await logWebhookEvent(event, false, error instanceof Error ? error.message : "Unknown error");
    } catch (logError) {
      console.error("Failed to log failed webhook event:", logError);
    }

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

/**
 * GET /api/webhooks/revenuecat
 *
 * Health check endpoint for webhook configuration
 */
export async function GET() {
  return NextResponse.json({
    status: "RevenueCat webhook endpoint active",
    configured: RevenueCatConfig.isConfigured(),
    environment: RevenueCatConfig.isDevelopment() ? "development" : "production",
  });
}
