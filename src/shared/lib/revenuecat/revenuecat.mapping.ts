import { PaymentProcessor } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

/**
 * RevenueCat Product Mapping Service
 *
 * Manages mapping between RevenueCat products and internal subscription plans
 */
export class RevenueCatMapping {
  /**
   * Get subscription plan by RevenueCat product ID
   */
  static async getSubscriptionPlanByProductId(productId: string) {
    const mapping = await prisma.planProviderMapping.findFirst({
      where: {
        provider: PaymentProcessor.REVENUECAT,
        externalId: productId,
        isActive: true,
      },
      include: {
        plan: true,
      },
    });

    return mapping?.plan || null;
  }

  /**
   * Create or update RevenueCat product mapping
   */
  static async createOrUpdateProductMapping(planId: string, productId: string, region?: string, metadata?: Record<string, any>) {
    return prisma.planProviderMapping.upsert({
      where: {
        planId_provider_region: {
          planId,
          provider: PaymentProcessor.REVENUECAT,
          region: region || "",
        },
      },
      update: {
        externalId: productId,
        metadata: metadata ?? undefined,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        planId,
        provider: PaymentProcessor.REVENUECAT,
        externalId: productId,
        region: region || null,
        metadata: metadata ?? undefined,
        isActive: true,
      },
    });
  }

  /**
   * Get all RevenueCat product mappings
   */
  static async getAllRevenueCatMappings() {
    return prisma.planProviderMapping.findMany({
      where: {
        provider: PaymentProcessor.REVENUECAT,
        isActive: true,
      },
      include: {
        plan: true,
      },
    });
  }

  /**
   * Get RevenueCat product ID by subscription plan
   */
  static async getRevenueCatProductId(planId: string, region?: string) {
    const mapping = await prisma.planProviderMapping.findFirst({
      where: {
        planId,
        provider: PaymentProcessor.REVENUECAT,
        region: region || null,
        isActive: true,
      },
    });

    return mapping?.externalId || null;
  }

  /**
   * Validate RevenueCat product ID exists in our system
   */
  static async validateProductId(productId: string): Promise<boolean> {
    const mapping = await prisma.planProviderMapping.findFirst({
      where: {
        provider: PaymentProcessor.REVENUECAT,
        externalId: productId,
        isActive: true,
      },
    });

    return !!mapping;
  }

  /**
   * Get subscription plan with RevenueCat product mapping
   */
  static async getSubscriptionPlanWithMapping(planId: string) {
    return prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      include: {
        providerMappings: {
          where: {
            provider: PaymentProcessor.REVENUECAT,
            isActive: true,
          },
        },
      },
    });
  }
}
