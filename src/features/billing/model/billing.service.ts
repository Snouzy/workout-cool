/* eslint-disable no-case-declarations */
import { prisma } from "@/shared/lib/prisma";

import type { BillingMode, PaymentProcessor, SubscriptionStatus, Platform } from "@prisma/client";

export class BillingService {
  private static instance: BillingService;

  private constructor() {}

  static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  // ========================================
  // Configuration
  // ========================================

  async getConfiguration() {
    const config = await prisma.appConfiguration.findUnique({
      where: { id: "default" },
    });

    if (!config) {
      // Create default configuration
      return await prisma.appConfiguration.create({
        data: {
          id: "default",
          billingMode: "DISABLED",
          freeUserLimits: {
            maxWorkouts: -1, // Unlimited
            maxExercises: -1,
            premiumExercises: true,
            canTrackWorkouts: true,
          },
        },
      });
    }

    return config;
  }

  async updateConfiguration(data: { billingMode?: BillingMode; activeProcessor?: PaymentProcessor; freeUserLimits?: Record<string, any> }) {
    return await prisma.appConfiguration.update({
      where: { id: "default" },
      data,
    });
  }

  // ========================================
  // Check permissions
  // ========================================

  async canAccessPremiumFeature(userId: string): Promise<boolean> {
    const config = await this.getConfiguration();

    switch (config.billingMode) {
      case "DISABLED":
        // Everything is free in self-hosted since it does not cost any money.
        return true;

      case "LICENSE_KEY":
        // Check license key
        const license = await prisma.license.findFirst({
          where: {
            userId,
            OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
          },
        });
        return !!license;

      case "SUBSCRIPTION":
      case "FREEMIUM":
        // Check active subscription
        const subscription = await prisma.subscription.findFirst({
          where: {
            userId,
            status: "ACTIVE",
          },
        });

        if (subscription) return true;

        // Check isPremium for legacy users
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { isPremium: true, premiumUntil: true },
        });

        if (user?.isPremium) {
          if (!user.premiumUntil || user.premiumUntil > new Date()) {
            return true;
          }
        }

        return false;

      default:
        return false;
    }
  }

  async getUserLimits(userId: string) {
    const config = await this.getConfiguration();
    const isPremium = await this.canAccessPremiumFeature(userId);

    if (isPremium || config.billingMode === "DISABLED") {
      return {
        maxWorkouts: -1,
        maxExercises: -1,
        premiumExercises: true,
        canTrackWorkouts: true,
      };
    }

    return (
      config.freeUserLimits || {
        maxWorkouts: 10,
        maxExercises: 100,
        canTrackWorkouts: false,
        premiumExercises: false,
      }
    );
  }

  // ========================================
  // Subscription management
  // ========================================

  async createSubscription(data: {
    userId: string;
    planId: string;
    platform: Platform;
    revenueCatUserId?: string;
    revenueCatEntitlement?: string;
  }) {
    // Check if there is already a subscription for this platform
    const existing = await prisma.subscription.findUnique({
      where: {
        userId_platform: {
          userId: data.userId,
          platform: data.platform,
        },
      },
    });

    if (existing) {
      // Update existing subscription
      return await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          planId: data.planId,
          status: "ACTIVE",
          revenueCatUserId: data.revenueCatUserId,
          revenueCatEntitlement: data.revenueCatEntitlement,
          startedAt: new Date(),
        },
      });
    }

    // Create a new subscription
    return await prisma.subscription.create({
      data: {
        ...data,
        status: "ACTIVE",
        startedAt: new Date(),
      },
    });
  }

  async updateSubscriptionStatus(subscriptionId: string, status: SubscriptionStatus, currentPeriodEnd?: Date) {
    return await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status,
        currentPeriodEnd,
        cancelledAt: status === "CANCELLED" ? new Date() : undefined,
      },
    });
  }

  // ========================================
  // License management (self-hosted)
  // ========================================

  async validateLicense(key: string): Promise<boolean> {
    const license = await prisma.license.findUnique({
      where: { key },
      include: { user: true },
    });

    if (!license) return false;

    // Check validity
    const now = new Date();
    if (license.validFrom > now) return false;
    if (license.validUntil && license.validUntil < now) return false;

    // Update lastCheckedAt
    await prisma.license.update({
      where: { id: license.id },
      data: { lastCheckedAt: now },
    });

    return true;
  }

  async activateLicense(key: string, userId: string) {
    const license = await prisma.license.findUnique({
      where: { key },
    });

    if (!license) {
      throw new Error("Invalid license key");
    }

    if (license.userId && license.userId !== userId) {
      throw new Error("License already activated by another user");
    }

    return await prisma.license.update({
      where: { id: license.id },
      data: {
        userId,
        activatedAt: new Date(),
      },
    });
  }
}

export const billingService = BillingService.getInstance();
