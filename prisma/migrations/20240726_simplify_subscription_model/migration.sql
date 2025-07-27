-- Simplify Subscription model by removing unnecessary RevenueCat fields
ALTER TABLE "subscriptions" 
DROP COLUMN IF EXISTS "revenueCatTransactionId",
DROP COLUMN IF EXISTS "revenueCatProductId",
DROP COLUMN IF EXISTS "revenueCatEntitlement";