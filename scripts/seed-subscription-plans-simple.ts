#!/usr/bin/env ts-node

import { PrismaClient, PaymentProcessor } from "@prisma/client";

import { env } from "@/env";

const prisma = new PrismaClient();

/**
 * Seed subscription plans - KISS approach
 * Simplified version without translations (handled client-side)
 */
async function seedSubscriptionPlans() {
  console.log("🌱 Seeding subscription plans (KISS approach)...");

  try {
    // Create monthly plan
    const monthlyPlan = await prisma.subscriptionPlan.upsert({
      where: { id: "premium-monthly" },
      update: {},
      create: {
        id: "premium-monthly",
        priceMonthly: 7.9,
        priceYearly: 0,
        currency: "EUR",
        interval: "month",
        isActive: true,
        availableRegions: ["EU", "US", "UK"],
      },
    });

    // Create yearly plan
    const yearlyPlan = await prisma.subscriptionPlan.upsert({
      where: { id: "premium-yearly" },
      update: {},
      create: {
        id: "premium-yearly",
        priceMonthly: 0,
        priceYearly: 49.0,
        currency: "EUR",
        interval: "year",
        isActive: true,
        availableRegions: ["EU", "US", "UK"],
      },
    });

    console.log("✅ Created subscription plans:", {
      monthly: monthlyPlan.id,
      yearly: yearlyPlan.id,
    });

    // Create Stripe provider mappings
    console.log("🔗 Creating Stripe provider mappings...");

    // Monthly plan Stripe mapping
    await prisma.planProviderMapping.upsert({
      where: {
        planId_provider_region: {
          planId: monthlyPlan.id,
          provider: PaymentProcessor.STRIPE,
          region: "EU",
        },
      },
      update: {},
      create: {
        planId: monthlyPlan.id,
        provider: PaymentProcessor.STRIPE,
        externalId: env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_EU || "price_monthly_fallback",
        region: "EU",
        metadata: {
          description: "Stripe monthly subscription for EU region",
        },
        isActive: true,
      },
    });

    // Yearly plan Stripe mapping
    await prisma.planProviderMapping.upsert({
      where: {
        planId_provider_region: {
          planId: yearlyPlan.id,
          provider: PaymentProcessor.STRIPE,
          region: "EU",
        },
      },
      update: {},
      create: {
        planId: yearlyPlan.id,
        provider: PaymentProcessor.STRIPE,
        externalId: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_EU || "price_yearly_fallback",
        region: "EU",
        metadata: {
          description: "Stripe yearly subscription for EU region",
        },
        isActive: true,
      },
    });

    console.log("✅ Created Stripe provider mappings");

    console.log("✅ Subscription plans seeded successfully!");
    console.log(`
📋 Summary:
- Created 2 subscription plans (monthly: €7.90, yearly: €49.00)
- Created Stripe provider mappings for EU region
- Names, descriptions, features handled client-side with i18n
- Ready for multi-region and multi-provider expansion

🔧 Next steps:
1. Set up your Stripe price IDs in environment variables:
   - NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
   - NEXT_PUBLIC_STRIPE_PRICE_YEARLY
2. Test the premium system with: npm run dev
3. Visit /premium to see the new plans
    `);
  } catch (error) {
    console.error("❌ Error seeding subscription plans:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedSubscriptionPlans()
    .then(() => {
      console.log("🎉 Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export default seedSubscriptionPlans;
