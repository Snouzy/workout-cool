-- Add RevenueCat transaction and product IDs to Subscription table
ALTER TABLE "subscriptions" ADD COLUMN "revenueCatTransactionId" TEXT;
ALTER TABLE "subscriptions" ADD COLUMN "revenueCatProductId" TEXT;

-- Create RevenueCat webhook event logging table
CREATE TABLE "revenuecat_webhook_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventTimestamp" TIMESTAMP(3) NOT NULL,
    "appUserId" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "productId" TEXT,
    "transactionId" TEXT,
    "originalTransactionId" TEXT,
    "entitlementIds" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processingError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "rawEventData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenuecat_webhook_events_pkey" PRIMARY KEY ("id")
);

-- Create indexes for efficient querying
CREATE INDEX "revenuecat_webhook_events_appUserId_idx" ON "revenuecat_webhook_events"("appUserId");
CREATE INDEX "revenuecat_webhook_events_eventType_idx" ON "revenuecat_webhook_events"("eventType");
CREATE INDEX "revenuecat_webhook_events_processed_idx" ON "revenuecat_webhook_events"("processed");
CREATE INDEX "revenuecat_webhook_events_eventTimestamp_idx" ON "revenuecat_webhook_events"("eventTimestamp");