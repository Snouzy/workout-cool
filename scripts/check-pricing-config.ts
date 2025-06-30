#!/usr/bin/env ts-node

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkPricingConfig() {
  console.log("🔍 Checking pricing configuration...\n");

  try {
    // Get all subscription plans
    const plans = await prisma.subscriptionPlan.findMany({
      include: {
        providerMappings: true,
      },
      orderBy: [{ currency: "asc" }, { priceMonthly: "asc" }],
    });

    console.log(`📊 Found ${plans.length} subscription plans:\n`);

    // Group by currency
    const plansByCurrency = plans.reduce(
      (acc, plan) => {
        if (!acc[plan.currency]) acc[plan.currency] = [];
        acc[plan.currency].push(plan);
        return acc;
      },
      {} as Record<string, typeof plans>,
    );

    // Display plans by currency
    for (const [currency, currencyPlans] of Object.entries(plansByCurrency)) {
      console.log(`💰 ${currency} Plans:`);
      console.log("─".repeat(50));

      for (const plan of currencyPlans) {
        const price = plan.priceMonthly?.toNumber() || plan.priceYearly?.toNumber() || 0;
        const interval = plan.interval;
        const regions = plan.availableRegions.join(", ");
        const mappingsCount = plan.providerMappings.length;

        console.log(`📌 ${plan.id}`);
        console.log(`   Price: ${price} ${currency}/${interval}`);
        console.log(`   Regions: ${regions}`);
        console.log(`   Active: ${plan.isActive ? "✅" : "❌"}`);
        console.log(`   Provider mappings: ${mappingsCount}`);

        if (plan.providerMappings.length > 0) {
          console.log("   Stripe prices:");
          for (const mapping of plan.providerMappings) {
            console.log(`     - ${mapping.region}: ${mapping.externalId} (${mapping.isActive ? "active" : "inactive"})`);
          }
        }
        console.log("");
      }
    }

    // Check for missing configurations
    console.log("\n⚠️  Configuration checks:");
    console.log("─".repeat(50));

    const plansWithoutMappings = plans.filter((p) => p.providerMappings.length === 0);
    if (plansWithoutMappings.length > 0) {
      console.log(`❌ ${plansWithoutMappings.length} plans without Stripe mappings:`);
      plansWithoutMappings.forEach((p) => console.log(`   - ${p.id}`));
    } else {
      console.log("✅ All plans have Stripe mappings");
    }

    // Region coverage check
    const regions = ["EU", "US", "UK", "BR", "RU", "CN", "LATAM"];
    const coveredRegions = new Set(plans.flatMap((p) => p.availableRegions));
    const missingRegions = regions.filter((r) => !coveredRegions.has(r));

    if (missingRegions.length > 0) {
      console.log(`\n❌ Missing coverage for regions: ${missingRegions.join(", ")}`);
    } else {
      console.log("\n✅ All regions have pricing coverage");
    }

    // Summary
    console.log("\n📈 Summary:");
    console.log("─".repeat(50));
    console.log(`Total plans: ${plans.length}`);
    console.log(`Currencies: ${Object.keys(plansByCurrency).join(", ")}`);
    console.log(`Covered regions: ${Array.from(coveredRegions).join(", ")}`);
  } catch (error) {
    console.error("❌ Error checking pricing config:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  checkPricingConfig()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default checkPricingConfig;
