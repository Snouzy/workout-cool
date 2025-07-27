import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

/**
 * Get Premium Status (Unified)
 *
 * GET /api/premium/status
 *
 * Returns the premium status for the current user, checking both:
 * - RevenueCat subscriptions (mobile)
 * - Stripe subscriptions (legacy web)
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getMobileCompatibleSession(request);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({
        isPremium: false,
        source: null,
        message: "User not authenticated",
      });
    }

    // First, check the user's isPremium flag (updated by RevenueCat sync or Stripe)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isPremium: true },
    });

    // Then check for active subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      select: {
        id: true,
        platform: true,
        revenueCatUserId: true,
        currentPeriodEnd: true,
        plan: {
          select: {
            interval: true,
            priceMonthly: true,
            priceYearly: true,
            currency: true,
          },
        },
      },
    });

    // Determine premium status and source
    const hasRevenueCatSub = activeSubscriptions.some((sub) => sub.revenueCatUserId);
    const hasStripeSub = activeSubscriptions.some((sub) => !sub.revenueCatUserId && sub.platform === "WEB");
    const isPremium = dbUser?.isPremium || activeSubscriptions.length > 0;

    // Find the most relevant subscription to display
    const primarySubscription = activeSubscriptions.find((sub) => sub.revenueCatUserId) || activeSubscriptions[0];

    return NextResponse.json({
      isPremium,
      source: hasRevenueCatSub ? "revenuecat" : hasStripeSub ? "stripe" : null,
      subscriptions: {
        hasRevenueCat: hasRevenueCatSub,
        hasStripe: hasStripeSub,
        count: activeSubscriptions.length,
      },
      currentSubscription: primarySubscription
        ? {
            platform: primarySubscription.platform,
            expiresAt: primarySubscription.currentPeriodEnd,
            plan: primarySubscription.plan,
          }
        : null,
      // Legacy support message for Stripe users
      legacyMessage:
        hasStripeSub && !hasRevenueCatSub ? "Vous avez un abonnement Stripe actif. Il restera valide jusqu'à son expiration." : null,
    });
  } catch (error) {
    console.error("Error getting premium status:", error);
    return NextResponse.json({ error: "Failed to get premium status" }, { status: 500 });
  }
}
