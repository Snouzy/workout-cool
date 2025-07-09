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
   * Assign RevenueCat user ID to a user
   * Links RevenueCat user ID to BetterAuth user account
   */
  static async assignRevenueCatUserId(userId: string, revenueCatUserId: string): Promise<void> {
    // Check if RevenueCat user ID is already assigned to another user
    const existingUser = await prisma.user.findFirst({
      where: {
        subscriptions: {
          some: {
            revenueCatUserId: revenueCatUserId,
            userId: { not: userId },
          },
        },
      },
    });

    if (existingUser) {
      throw new Error(`RevenueCat user ID ${revenueCatUserId} is already assigned to another user`);
    }

    // Get or create a default subscription plan
    let defaultPlan = await prisma.subscriptionPlan.findFirst({
      where: { isActive: true },
      orderBy: { priceMonthly: "asc" },
    });

    if (!defaultPlan) {
      // Create a default plan if none exists
      defaultPlan = await prisma.subscriptionPlan.create({
        data: {
          priceMonthly: 0,
          priceYearly: 0,
          currency: "EUR",
          interval: "month",
          isActive: true,
          availableRegions: [],
        },
      });
    }

    // Create or update subscription record with RevenueCat user ID
    await prisma.subscription.upsert({
      where: {
        userId_platform: {
          userId,
          platform: Platform.IOS, // Default to iOS for mobile
        },
      },
      update: {
        revenueCatUserId,
        updatedAt: new Date(),
      },
      create: {
        userId,
        planId: defaultPlan.id,
        platform: Platform.IOS,
        status: "ACTIVE",
        startedAt: new Date(),
        revenueCatUserId,
      },
    });
  }

  /**
   * Link anonymous RevenueCat user to authenticated BetterAuth user
   * Migrates subscription data from anonymous to authenticated user
   */
  static async linkRevenueCatUser(
    authenticatedUserId: string,
    anonymousRevenueCatUserId: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Find subscriptions with the anonymous RevenueCat user ID
      const anonymousSubscriptions = await tx.subscription.findMany({
        where: {
          revenueCatUserId: anonymousRevenueCatUserId,
        },
      });

      // Transfer subscriptions to authenticated user
      for (const subscription of anonymousSubscriptions) {
        await tx.subscription.update({
          where: { id: subscription.id },
          data: {
            userId: authenticatedUserId,
            updatedAt: new Date(),
          },
        });
      }

      // Update user premium status if any active subscriptions exist
      const hasActiveSubscriptions = anonymousSubscriptions.some(
        (sub) => sub.status === "ACTIVE"
      );

      if (hasActiveSubscriptions) {
        await tx.user.update({
          where: { id: authenticatedUserId },
          data: { isPremium: true },
        });
      }
    });
  }

  /**
   * Get user by RevenueCat user ID
   */
  static async getUserByRevenueCatId(revenueCatUserId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        revenueCatUserId: revenueCatUserId,
      },
      include: {
        user: true,
      },
    });

    return subscription?.user || null;
  }

  /**
   * Check if user has RevenueCat user ID assigned
   */
  static async hasRevenueCatUserId(userId: string): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        revenueCatUserId: { not: null },
      },
    });

    return !!subscription;
  }

  /**
   * Get user's RevenueCat user ID
   */
  static async getUserRevenueCatId(userId: string): Promise<string | null> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        revenueCatUserId: { not: null },
      },
    });

    return subscription?.revenueCatUserId || null;
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

  /**
   * Check premium status specifically from RevenueCat entitlements
   */
  static async checkRevenueCatPremiumStatus(userId: string): Promise<PremiumStatus> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPremium: true,
        subscriptions: {
          where: {
            status: "ACTIVE",
            revenueCatUserId: { not: null },
          },
          select: {
            currentPeriodEnd: true,
            revenueCatUserId: true,
            revenueCatEntitlement: true,
            revenueCatTransactionId: true,
            plan: {
              select: { id: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return { isPremium: false };
    }

    // Check for active RevenueCat subscriptions
    const activeRevenueCatSubscriptions = user.subscriptions.filter(sub => {
      // Must have RevenueCat data
      if (!sub.revenueCatUserId || !sub.revenueCatEntitlement) {
        return false;
      }

      // Check expiry if available
      if (sub.currentPeriodEnd) {
        return sub.currentPeriodEnd > new Date();
      }

      // If no expiry date, assume active (lifetime or ongoing)
      return true;
    });

    const isPremium = activeRevenueCatSubscriptions.length > 0;

    return {
      isPremium,
      subscriptions: activeRevenueCatSubscriptions.map((sub): UserSubscription => ({
        id: sub.plan.id,
        expiryDate: sub.currentPeriodEnd || null,
        isActive: true,
        revenueCatData: {
          userId: sub.revenueCatUserId!,
          entitlement: sub.revenueCatEntitlement!,
          transactionId: sub.revenueCatTransactionId,
        },
      })),
    };
  }

  /**
   * Validate RevenueCat entitlement for specific features
   */
  static async validateRevenueCatEntitlement(userId: string, requiredEntitlement: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptions: {
          where: {
            status: "ACTIVE",
            revenueCatEntitlement: { contains: requiredEntitlement },
          },
          select: {
            currentPeriodEnd: true,
            revenueCatEntitlement: true,
          },
        },
      },
    });

    if (!user) {
      return false;
    }

    // Check if any subscription has the required entitlement and is not expired
    return user.subscriptions.some(sub => {
      const hasEntitlement = sub.revenueCatEntitlement?.includes(requiredEntitlement);
      const isNotExpired = !sub.currentPeriodEnd || sub.currentPeriodEnd > new Date();
      return hasEntitlement && isNotExpired;
    });
  }
}
