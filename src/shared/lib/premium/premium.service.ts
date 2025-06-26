import { PaymentProcessor, Platform } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

import type { PremiumStatus, UserSubscription } from "@/shared/types/premium.types";

/**
 * Premium Service - KISS approach
 *
 * Single responsibility: Determine if a user has premium access
 * Provider agnostic: Works with any payment system
 * Type safe: Strict TypeScript to prevent errors
 */
export class PremiumService {
  /**
   * Check if user has premium access
   */
  static async checkUserPremiumStatus(userId: string): Promise<PremiumStatus> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPremium: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          select: {
            currentPeriodEnd: true,
            plan: {
              select: { id: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return { isPremium: false };
    }

    // Quick check on isPremium flag
    if (!user.isPremium) {
      return { isPremium: false };
    }

    // Verify with active subscription for expiry date
    const activeSubscription = user.subscriptions[0];
    if (activeSubscription?.currentPeriodEnd) {
      const isExpired = activeSubscription.currentPeriodEnd < new Date();

      if (!isExpired) {
        return {
          isPremium: true,
          expiresAt: activeSubscription.currentPeriodEnd,
          provider: "stripe", // Default for now
        };
      }
    }

    // If isPremium is true but no active subscription, it's inconsistent
    // Should update isPremium to false (data cleanup)
    return { isPremium: false };
  }

  /**
   * Get user subscription info for UI
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription> {
    const premiumStatus = await this.checkUserPremiumStatus(userId);

    if (!premiumStatus.isPremium) {
      return { isActive: false };
    }

    return {
      isActive: true,
      nextBillingDate: premiumStatus.expiresAt,
      cancelAtPeriodEnd: false, // TODO: implement based on provider
    };
  }

  /**
   * Grant premium access (for webhooks or admin)
   * Creates/updates subscription record and maintains backward compatibility
   */
  static async grantPremiumAccess(
    userId: string,
    expiresAt: Date,
    options?: {
      planId?: string;
      platform?: Platform;
      paymentProcessor?: PaymentProcessor;
    },
  ): Promise<void> {
    // Get default premium plan if not specified
    let planId = options?.planId;
    if (!planId) {
      const defaultPlan = await prisma.subscriptionPlan.findFirst({
        where: { isActive: true },
        orderBy: { priceMonthly: "asc" }, // Get cheapest as default
      });
      planId = defaultPlan?.id;
    }

    // Transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update user isPremium flag
      await tx.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
        },
      });

      // Create or update subscription record
      if (planId) {
        const platform = options?.platform || Platform.WEB;

        await tx.subscription.upsert({
          where: {
            userId_platform: {
              userId,
              platform,
            },
          },
          update: {
            status: "ACTIVE",
            currentPeriodEnd: expiresAt,
            planId,
            updatedAt: new Date(),
          },
          create: {
            userId,
            planId,
            platform,
            status: "ACTIVE",
            startedAt: new Date(),
            currentPeriodEnd: expiresAt,
          },
        });
      }
    });
  }

  /**
   * Revoke premium access
   * Updates subscription status and maintains backward compatibility
   */
  static async revokePremiumAccess(userId: string, platform?: Platform): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update user isPremium flag
      await tx.user.update({
        where: { id: userId },
        data: {
          isPremium: false,
        },
      });

      // Cancel active subscriptions
      if (platform) {
        // Cancel specific platform subscription
        await tx.subscription.updateMany({
          where: {
            userId,
            platform,
            status: "ACTIVE",
          },
          data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
          },
        });
      } else {
        // Cancel all active subscriptions
        await tx.subscription.updateMany({
          where: {
            userId,
            status: "ACTIVE",
          },
          data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
          },
        });
      }
    });
  }
}
