import { PaymentProcessor, PlanProviderMapping } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { env } from "@/env";

import { StripeProvider } from "./providers/stripe-provider";
import { PremiumService } from "./premium.service";

import type { PremiumPlan, CheckoutResult } from "@/shared/types/premium.types";
import type { PaymentProvider } from "./providers/base-provider";

/**
 * Premium Manager - KISS orchestrator
 *
 * Simple manager that coordinates between providers and services
 * Easy to extend with new payment providers
 */
export class PremiumManager {
  private static providers: Record<string, PaymentProvider> = {
    stripe: new StripeProvider(),
  };

  /**
   * Get available premium plans with provider mappings
   * Returns 3 plans: Free, Supporter, Premium - fitness focused
   */
  static async getAvailablePlans(provider?: string, region?: string): Promise<PremiumPlan[]> {
    // Try to get plans from database first
    const dbPlans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
        // Filter by region if specified
        ...(region && {
          availableRegions: {
            hasSome: [region],
          },
        }),
      },
      include: {
        providerMappings: {
          where: {
            isActive: true,
            ...(provider && { provider: provider.toUpperCase() as PaymentProcessor }),
            ...(region && { region }),
          },
        },
      },
      orderBy: { priceMonthly: "asc" },
    });

    // Always include the free plan as first option
    const freePlan: PremiumPlan = {
      id: "free",
      name: "Free",
      type: "free",
      priceMonthly: 0,
      priceYearly: 0,
      currency: "EUR",
      description: "Toutes les fonctions essentielles pour s'entraîner",
      badge: "Open-Source • Toujours gratuit",
      features: [
        "Stepper 3 étapes (Équipement → Muscles → Exercices)",
        "8 types d'équipements (Poids du corps, Haltères, Barre...)",
        "Sélection muscles ciblés (Pectoraux, Biceps, Trapèzes...)",
        "Génération exercices avec vidéos",
        "Suivi séances avec séries/reps/poids/temps",
        "Historique type GitHub de tes séances",
        "Partage et reprise de séances",
        "Auto-hébergement possible",
        "Code source disponible",
      ],
    };

    // Convert database plans to PremiumPlan format or use fallback
    let paidPlans: PremiumPlan[] = [];

    if (dbPlans.length > 0) {
      paidPlans = dbPlans.map((plan) => {
        // Get the appropriate provider mapping
        const mapping = plan.providerMappings.find(
          (m) => (!provider || m.provider === provider.toUpperCase()) && (!region || m.region === region || !m.region),
        );

        // Determine plan type from pricing structure
        const isYearly = plan.priceYearly && plan.priceYearly.toNumber() > 0;
        const planType = isYearly ? "yearly" : "monthly";

        return {
          id: mapping?.externalId || plan.id,
          internalId: plan.id, // Keep internal ID for database operations
          name: `Premium ${planType.charAt(0).toUpperCase() + planType.slice(1)}`,
          type: "premium", // Database plans are premium by default
          priceMonthly: plan.priceMonthly?.toNumber() || 0,
          priceYearly: plan.priceYearly?.toNumber() || 0,
          currency: (plan.currency || "EUR") as "EUR" | "USD",
          features: [], // Features handled client-side
        };
      });
    } else {
      // Fallback to the new 3-plan structure
      paidPlans = [
        {
          id: "supporter",
          name: "Supporter",
          type: "supporter",
          priceMonthly: 4.99,
          priceYearly: 0,
          currency: "EUR",
          description: "Aide à payer les serveurs + fonctions bonus",
          badge: "Soutenir la mission",
          features: [
            "Tout du plan Gratuit",
            "Statistiques avancées (volume, progression, PR)",
            "Programmes d'entraînement pré-conçus",
            "Export de données (PDF, CSV)",
            "Thèmes personnalisés",
            "Notifications push",
            "Historique illimité (vs 6 mois gratuit)",
            "Support prioritaire",
            "Badge 'Supporter' dans la communauté",
          ],
        },
        {
          id: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "premium",
          name: "Premium",
          type: "premium",
          priceMonthly: 9.99,
          priceYearly: 0,
          currency: "EUR",
          description: "Toutes les fonctions + accès anticipé",
          badge: "PLUS POPULAIRE • Pour les passionnés",
          isPopular: true,
          isRecommended: true,
          features: [
            "Tout du plan Supporter",
            "IA coaching personnalisé (suggestions exercices)",
            "Analyses biomécanique avancées",
            "Création exercices personnalisés avec vidéos",
            "API access pour développeurs",
            "Accès anticipé aux nouvelles features",
            "Badges exclusifs et achievements",
            "Communauté privée Discord",
            "Sessions coaching vidéo mensuelles",
            "Templates séances pros (powerlifting, bodybuilding...)",
          ],
        },
      ];
    }

    // Return all 3 plans: Free + Paid plans
    return [freePlan, ...paidPlans];
  }

  /**
   * Create checkout for a plan using provider mapping
   */
  static async createCheckout(userId: string, planId: string, provider: string = "stripe", region?: string): Promise<CheckoutResult> {
    const paymentProvider = this.providers[provider];
    if (!paymentProvider) {
      return {
        success: false,
        error: `Provider ${provider} not supported`,
        provider: provider as any,
      };
    }

    // Get plans filtered by provider and region
    const plans = await this.getAvailablePlans(provider, region);
    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      return {
        success: false,
        error: "Plan not found",
        provider: provider as any,
      };
    }

    return paymentProvider.createCheckoutSession(userId, plan);
  }

  /**
   * Process webhook from any provider
   */
  static async processWebhook(provider: string, payload: any, signature: string): Promise<{ success: boolean; error?: string }> {
    const paymentProvider = this.providers[provider];
    if (!paymentProvider) {
      return { success: false, error: `Provider ${provider} not supported` };
    }

    try {
      const result = await paymentProvider.processWebhook(payload, signature);

      if (result.success && result.userId && result.action) {
        // Update user premium status based on webhook

        switch (result.action) {
          case "subscription_created":
          case "payment_succeeded":
          case "subscription_updated":
            if (result.expiresAt) {
              await PremiumService.grantPremiumAccess(result.userId, result.expiresAt, {
                planId: result.planId,
                platform: result.platform,
                paymentProcessor: provider === "stripe" ? "STRIPE" : ("OTHER" as any),
              });
            }
            break;

          case "subscription_cancelled":
            await PremiumService.revokePremiumAccess(result.userId, result.platform);
            break;
        }
      }

      return { success: result.success, error: result.error };
    } catch (error) {
      console.error("Webhook processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get plan by external ID across all providers
   */
  static async getPlanByInternalId(internalId: string, provider: string): Promise<PlanProviderMapping> {
    const mapping = await prisma.planProviderMapping.findFirst({
      where: {
        planId: internalId,
        provider: provider.toUpperCase() as any,
        isActive: true,
      },
      include: {
        plan: true,
      },
    });

    if (!mapping) {
      throw new Error(`Plan ${internalId} not found for provider ${provider}`);
    }

    return mapping;
  }

  /**
   * Get plan by external ID across all providers
   */
  static async getPlanByExternalId(externalId: string, provider: string): Promise<any> {
    const mapping = await prisma.planProviderMapping.findFirst({
      where: {
        externalId,
        provider: provider.toUpperCase() as any,
        isActive: true,
      },
      include: {
        plan: true,
      },
    });

    return mapping?.plan;
  }

  /**
   * Create billing portal session for subscription management
   */
  static async createBillingPortal(userId: string, provider: string = "stripe", returnUrl?: string): Promise<CheckoutResult> {
    const paymentProvider = this.providers[provider];
    if (!paymentProvider) {
      return {
        success: false,
        error: `Provider ${provider} not supported`,
        provider: provider as any,
      };
    }

    // For Stripe, we need to find the customer ID
    if (provider === "stripe") {
      const stripeProvider = paymentProvider as StripeProvider;

      // Get customer by user ID
      const customer = await stripeProvider.getCustomerByUserId(userId);

      if (!customer) {
        return {
          success: false,
          error: "No Stripe customer found. Please subscribe first.",
          provider: "stripe",
        };
      }

      return stripeProvider.createPortalSession(customer.id, returnUrl);
    }

    return {
      success: false,
      error: "Billing portal not implemented for this provider",
      provider: provider as any,
    };
  }

  /**
   * Add new payment provider (for future expansion)
   */
  static addProvider(name: string, provider: PaymentProvider): void {
    this.providers[name] = provider;
  }
}
