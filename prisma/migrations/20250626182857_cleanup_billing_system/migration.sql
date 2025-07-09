/*
  Warnings:

  - You are about to drop the column `description` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `externalProductId` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `isVisibleInSelfHosted` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `revenueCatProductId` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the `app_configuration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webhook_events` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `currency` on table `subscription_plans` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "subscription_plans_revenueCatProductId_key";

-- AlterTable
ALTER TABLE "subscription_plans" DROP COLUMN "description",
DROP COLUMN "externalProductId",
DROP COLUMN "features",
DROP COLUMN "isVisibleInSelfHosted",
DROP COLUMN "name",
DROP COLUMN "revenueCatProductId",
ADD COLUMN     "availableRegions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "interval" TEXT NOT NULL DEFAULT 'month',
ALTER COLUMN "currency" SET NOT NULL;

-- DropTable
DROP TABLE "app_configuration";

-- DropTable
DROP TABLE "webhook_events";

-- DropEnum
DROP TYPE "BillingMode";

-- CreateTable
CREATE TABLE "plan_provider_mappings" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "provider" "PaymentProcessor" NOT NULL,
    "externalId" TEXT NOT NULL,
    "region" TEXT,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_provider_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plan_provider_mappings_provider_externalId_idx" ON "plan_provider_mappings"("provider", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "plan_provider_mappings_planId_provider_region_key" ON "plan_provider_mappings"("planId", "provider", "region");

-- AddForeignKey
ALTER TABLE "plan_provider_mappings" ADD CONSTRAINT "plan_provider_mappings_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
