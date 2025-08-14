import { PaymentProcessor, Platform } from "@prisma/client";

import { revenueCatApi } from "@/shared/lib/revenuecat";
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
      // select: {
      //   isPremium: true,
      //   subscriptions: {
      //     where: { status: "ACTIVE" },
      //     select: {
      //       currentPeriodEnd: true,
      //       plan: {
      //         select: { id: true },
      //       },
      //     },
      //     orderBy: { createdAt: "desc" },
      //     take: 1,
      //   },
      // },
    });

    if (!user || !user.isPremium) {
      return { isPremium: false };
    }

    return { isPremium: true };
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
      revenueCatUserId?: string;
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
            revenueCatUserId: options?.revenueCatUserId,
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
    console.log(`Assigning RevenueCat user ID ${revenueCatUserId} to user ${userId}`);

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

    // After assigning the RevenueCat user ID, sync the current subscription status
    // This ensures the user's premium status is accurate based on current entitlements
    try {
      await this.syncRevenueCatStatus(userId, revenueCatUserId);
    } catch (error) {
      console.error("Error syncing RevenueCat status after assignment:", error);
      // Don't throw here to avoid breaking the assignment flow
      // The sync failure will be logged but won't prevent assignment
    }
  }

  /**
   * Link anonymous RevenueCat user to authenticated BetterAuth user
   * Migrates subscription data from anonymous to authenticated user
   */
  static async linkRevenueCatUser(authenticatedUserId: string, anonymousRevenueCatUserId: string): Promise<void> {
    console.log(`Linking anonymous RevenueCat user ${anonymousRevenueCatUserId} to authenticated user ${authenticatedUserId}`);

    await prisma.$transaction(async (tx) => {
      // Find subscriptions with the anonymous RevenueCat user ID
      const anonymousSubscriptions = await tx.subscription.findMany({
        where: {
          revenueCatUserId: anonymousRevenueCatUserId,
        },
      });

      console.log(`Found ${anonymousSubscriptions.length} anonymous subscriptions to transfer`);

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
      const hasActiveSubscriptions = anonymousSubscriptions.some((sub) => sub.status === "ACTIVE");

      if (hasActiveSubscriptions) {
        await tx.user.update({
          where: { id: authenticatedUserId },
          data: { isPremium: true },
        });
      }
    });

    // After linking, sync the current RevenueCat subscription status
    // This ensures the user's premium status is accurate based on current entitlements
    try {
      await this.syncRevenueCatStatus(authenticatedUserId, anonymousRevenueCatUserId);
    } catch (error) {
      console.error("Error syncing RevenueCat status after linking:", error);
      // Don't throw here to avoid breaking the linking flow
      // The sync failure will be logged but won't prevent account linking
    }
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
   * Fetch current subscription status from RevenueCat API
   * This method queries RevenueCat directly to get the most up-to-date subscription status
   */
  static async fetchRevenueCatSubscriptionStatus(revenueCatUserId: string): Promise<{
    isPremium: boolean;
    expiresAt: Date | null;
    entitlementIds: string[];
    error?: string;
  }> {
    try {
      console.log(`Fetching RevenueCat subscription status for user: ${revenueCatUserId}`);

      // Check if user has active entitlements
      const hasActiveEntitlements = await revenueCatApi.hasActiveEntitlements(revenueCatUserId);

      if (!hasActiveEntitlements) {
        console.log(`No active entitlements found for RevenueCat user: ${revenueCatUserId}`);
        return {
          isPremium: false,
          expiresAt: null,
          entitlementIds: [],
        };
      }

      // Get entitlement details
      const [expiresAt, entitlementIds] = await Promise.all([
        revenueCatApi.getLatestExpirationDate(revenueCatUserId),
        revenueCatApi.getActiveEntitlementIds(revenueCatUserId),
      ]);

      console.log(`RevenueCat subscription status for ${revenueCatUserId}:`, {
        isPremium: true,
        expiresAt,
        entitlementIds,
      });

      return {
        isPremium: true,
        expiresAt,
        entitlementIds,
      };
    } catch (error) {
      console.error("Error fetching RevenueCat subscription status:", error);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      return {
        isPremium: false,
        expiresAt: null,
        entitlementIds: [],
        error: errorMessage,
      };
    }
  }

  /**
   * Sync user's premium status with RevenueCat
   * Updates the database with the current RevenueCat subscription status
   */
  static async syncRevenueCatStatus(userId: string, revenueCatUserId: string): Promise<void> {
    try {
      console.log(`Syncing RevenueCat status for user ${userId} with RevenueCat user ${revenueCatUserId}`);

      // First, process any pending webhook events
      await this.processPendingWebhookEvents(userId, revenueCatUserId);

      // Fetch current status from RevenueCat
      const revenueCatStatus = await this.fetchRevenueCatSubscriptionStatus(revenueCatUserId);
      console.log("revenueCatStatus before sync:", revenueCatStatus);

      if (revenueCatStatus.error) {
        console.warn(`Failed to fetch RevenueCat status, skipping sync: ${revenueCatStatus.error}`);
        return;
      }

      // Update user's premium status in database
      await prisma.$transaction(async (tx) => {
        // Update user's isPremium flag
        await tx.user.update({
          where: { id: userId },
          data: { isPremium: revenueCatStatus.isPremium },
        });

        // Update subscription records
        await tx.subscription.updateMany({
          where: { userId, revenueCatUserId },
          data: {
            status: revenueCatStatus.isPremium ? "ACTIVE" : "EXPIRED",
            currentPeriodEnd: revenueCatStatus.expiresAt,
            revenueCatUserId,
            updatedAt: new Date(),
          },
        });
      });

      console.log(`Successfully synced RevenueCat status for user ${userId}: isPremium=${revenueCatStatus.isPremium}`);
    } catch (error) {
      console.error("Error syncing RevenueCat status:", error);

      // Don't throw here to avoid breaking the user flow
      // The sync failure will be logged but won't prevent account linking
    }
  }

  /**
   * Process pending webhook events for a user
   * This handles anonymous purchases that happened before authentication
   */
  static async processPendingWebhookEvents(userId: string, revenueCatUserId: string): Promise<void> {
    try {
      console.log(`Processing pending webhook events for user ${userId}`);

      // Find pending events for the anonymous RevenueCat user ID
      const pendingEvents = await prisma.revenueCatWebhookEvent.findMany({
        where: {
          appUserId: revenueCatUserId,
          processed: false,
        },
        orderBy: {
          eventTimestamp: "asc",
        },
      });

      if (pendingEvents.length === 0) {
        console.log("No pending webhook events found");
        return;
      }

      console.log(`Found ${pendingEvents.length} pending webhook events to process`);

      // Process each event
      for (const event of pendingEvents) {
        console.log(`Processing ${event.eventType} event from ${event.eventTimestamp}`);

        // Update the event with the authenticated user ID and mark as processed
        await prisma.revenueCatWebhookEvent.update({
          where: { id: event.id },
          data: {
            processed: true,
            processingError: null,
            updatedAt: new Date(),
          },
        });
      }

      console.log("Finished processing pending webhook events");
    } catch (error) {
      console.error("Error processing pending webhook events:", error);
      // Don't throw - continue with the sync even if event processing fails
    }
  }
}
