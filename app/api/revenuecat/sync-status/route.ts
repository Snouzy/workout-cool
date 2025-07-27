import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Platform } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

/**
 * Sync RevenueCat Status with Backend (Simplified)
 *
 * POST /api/revenuecat/sync-status
 *
 * Synchronizes the current RevenueCat subscription status with the backend.
 * RevenueCat is the source of truth - we only store the status for web access.
 */

const syncStatusSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  isPremium: z.boolean(),
  revenueCatUserId: z.string().optional(),
  entitlements: z.array(z.string()).optional(),
  platform: z.string(),
  expirationDate: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await serverRequiredUser();

    // Parse and validate request body
    const body = await request.json();
    const { userId, isPremium: isPremiumRevenueCat, revenueCatUserId, expirationDate } = syncStatusSchema.parse(body);
    console.log("expirationDate:", expirationDate);

    // Verify the userId matches the authenticated user
    if (userId !== user.id) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 });
    }

    const isPremium = isPremiumRevenueCat || user.isPremium;

    console.log(`[RevenueCat Sync] Syncing status for user ${userId}: isPremium=${isPremium}`);

    // Update user's premium status in the database
    await prisma.user.update({
      where: { id: userId },
      data: { isPremium },
    });

    // If user has premium, ensure we have a subscription record
    if (isPremium && revenueCatUserId) {
      // Check if user already has a mobile subscription
      const existingSubscription = await prisma.subscription.findUnique({
        where: {
          userId_platform: {
            userId,
            platform: Platform.ANDROID || Platform.IOS,
          },
        },
      });

      if (existingSubscription) {
        // Update existing subscription
        await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            revenueCatUserId,
            status: "ACTIVE",
            currentPeriodEnd: new Date(expirationDate),
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new subscription record
        // Find or create a default mobile plan
        let mobilePlan = await prisma.subscriptionPlan.findFirst({
          where: { interval: "month", isActive: true },
        });

        if (!mobilePlan) {
          // Create a default mobile plan if none exists
          mobilePlan = await prisma.subscriptionPlan.create({
            data: {
              priceMonthly: 9.99,
              currency: "USD",
              interval: "month",
              isActive: true,
            },
          });
        }

        await prisma.subscription.create({
          data: {
            userId,
            planId: mobilePlan.id,
            revenueCatUserId,
            status: "ACTIVE",
            platform: Platform.ANDROID || Platform.IOS,
            startedAt: new Date(),
            currentPeriodEnd: new Date(expirationDate),
          },
        });
      }
    } else if (!isPremium) {
      // User is not premium - update any active mobile subscriptions
      await prisma.subscription.updateMany({
        where: {
          userId,
          platform: Platform.ANDROID || Platform.IOS,
          status: "ACTIVE",
        },
        data: {
          status: "EXPIRED",
          cancelledAt: new Date(),
        },
      });
    }

    // Check if user has any Stripe subscriptions (legacy)
    const hasStripeSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        platform: { in: [Platform.WEB, Platform.IOS, Platform.ANDROID] },
        status: "ACTIVE",
        revenueCatUserId: null, // No RevenueCat ID means it's from Stripe
      },
    });

    return NextResponse.json({
      success: true,
      premiumStatus: {
        isPremium: isPremium || !!hasStripeSubscription,
        hasRevenueCatSubscription: isPremium,
        hasStripeSubscription: !!hasStripeSubscription,
        revenueCatUserId,
      },
    });
  } catch (error) {
    console.error("Error syncing RevenueCat status:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }

    // Handle known errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to sync RevenueCat status" }, { status: 500 });
  }
}
