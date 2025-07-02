#!/usr/bin/env ts-node

import { PrismaClient, PaymentProcessor } from "@prisma/client";

import { env } from "@/env";

const prisma = new PrismaClient();

interface RegionPricing {
  region: string;
  currency: string;
  monthlyPrice: number;
  yearlyPrice: number;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
}

// Prix adaptés par région
const regionPricing: RegionPricing[] = [
  {
    region: "EU",
    currency: "EUR",
    monthlyPrice: 7.9,
    yearlyPrice: 49,
    stripeMonthlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_EU,
    stripeYearlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_EU,
  },
  {
    region: "US",
    currency: "USD",
    monthlyPrice: 9.99,
    yearlyPrice: 59,
    stripeMonthlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_US,
    stripeYearlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_US,
  },
  {
    region: "LATAM", // Espagnol + Portugais (hors Brésil)
    currency: "USD",
    monthlyPrice: 4.99,
    yearlyPrice: 29,
    stripeMonthlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_LATAM,
    stripeYearlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_LATAM,
  },
  {
    region: "BR", // Brésil spécifiquement
    currency: "BRL",
    monthlyPrice: 19.9,
    yearlyPrice: 119,
    stripeMonthlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_BR,
    stripeYearlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_BR,
  },
  {
    region: "RU", // Russie
    currency: "RUB",
    monthlyPrice: 299,
    yearlyPrice: 1790,
    stripeMonthlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_RU,
    stripeYearlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_RU,
  },
  {
    region: "CN", // Chine
    currency: "CNY",
    monthlyPrice: 39,
    yearlyPrice: 239,
    stripeMonthlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_CN,
    stripeYearlyPriceId: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_CN,
  },
];

async function seedMultiRegionPlans() {
  console.log("🌍 Seeding multi-region subscription plans...");

  try {
    // Pour chaque région, créer les plans
    for (const pricing of regionPricing) {
      console.log(`\n📍 Creating plans for ${pricing.region}...`);

      // Plan mensuel
      const monthlyPlanId = `premium-monthly-${pricing.region.toLowerCase()}`;
      // const monthlyPlan = await prisma.subscriptionPlan.upsert({
      //   where: { id: monthlyPlanId },
      //   update: {
      //     priceMonthly: pricing.monthlyPrice,
      //     currency: pricing.currency,
      //   },
      //   create: {
      //     id: monthlyPlanId,
      //     priceMonthly: pricing.monthlyPrice,
      //     priceYearly: 0,
      //     currency: pricing.currency,
      //     interval: "month",
      //     isActive: true,
      //     availableRegions: [pricing.region],
      //   },
      // });

      // Plan annuel
      const yearlyPlanId = `premium-yearly-${pricing.region.toLowerCase()}`;
      // const yearlyPlan = await prisma.subscriptionPlan.upsert({
      //   where: { id: yearlyPlanId },
      //   update: {
      //     priceYearly: pricing.yearlyPrice,
      //     currency: pricing.currency,
      //   },
      //   create: {
      //     id: yearlyPlanId,
      //     priceMonthly: 0,
      //     priceYearly: pricing.yearlyPrice,
      //     currency: pricing.currency,
      //     interval: "year",
      //     isActive: true,
      //     availableRegions: [pricing.region],
      //   },
      // });

      // Créer les mappings Stripe si les IDs existent
      if (pricing.stripeMonthlyPriceId) {
        await prisma.planProviderMapping.upsert({
          where: {
            planId_provider_region: {
              planId: monthlyPlanId,
              provider: PaymentProcessor.STRIPE,
              region: pricing.region,
            },
          },
          update: {},
          create: {
            planId: monthlyPlanId,
            provider: PaymentProcessor.STRIPE,
            externalId: pricing.stripeMonthlyPriceId,
            region: pricing.region,
            isActive: true,
          },
        });
      }

      if (pricing.stripeYearlyPriceId) {
        await prisma.planProviderMapping.upsert({
          where: {
            planId_provider_region: {
              planId: yearlyPlanId,
              provider: PaymentProcessor.STRIPE,
              region: pricing.region,
            },
          },
          update: {},
          create: {
            planId: yearlyPlanId,
            provider: PaymentProcessor.STRIPE,
            externalId: pricing.stripeYearlyPriceId,
            region: pricing.region,
            isActive: true,
          },
        });
      }

      console.log(`✅ Created plans for ${pricing.region}:`);
      console.log(`   - Monthly: ${pricing.monthlyPrice} ${pricing.currency}`);
      console.log(`   - Yearly: ${pricing.yearlyPrice} ${pricing.currency}`);
    }

    console.log("\n✅ Multi-region plans seeded successfully!");
    console.log(`
📊 Summary:
- Created plans for ${regionPricing.length} regions
- Currencies: EUR, USD, BRL, RUB, CNY
- Total plans: ${regionPricing.length * 2} (monthly + yearly)

🔧 Next steps:
1. Create corresponding Stripe prices for each region
2. Update environment variables with Stripe price IDs
3. Test with different Accept-Language headers
    `);
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedMultiRegionPlans()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedMultiRegionPlans;
