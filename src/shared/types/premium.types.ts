// Simple premium types following KISS principle
// Keep It Stupid Simple - easy to understand and maintain

// Core premium status - single source of truth
export interface PremiumStatus {
  isPremium: boolean;
  expiresAt?: Date;
  provider?: PremiumProvider;
}

// Available payment providers - easy to extend
export type PremiumProvider = "stripe" | "paypal" | "lemonsqueezy" | "other";

// Premium plans - simple structure
export interface PremiumPlan {
  id: string; // External provider ID (e.g., price_1ABC)
  internalId?: string; // Internal database ID
  name: string;
  priceMonthly: number;
  priceYearly: number;
  currency: "EUR" | "USD";
  features: string[];
}

// Checkout session - provider agnostic
export interface CheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
  provider: PremiumProvider;
}

// User subscription info - what the UI needs
export interface UserSubscription {
  isActive: boolean;
  plan?: PremiumPlan;
  nextBillingDate?: Date;
  cancelAtPeriodEnd?: boolean;
}
