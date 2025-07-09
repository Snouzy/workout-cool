// Simple premium types following KISS principle
// Keep It Stupid Simple - easy to understand and maintain

// Core premium status - single source of truth
export interface PremiumStatus {
  isPremium: boolean;
  expiresAt?: Date;
  provider?: PremiumProvider;
  revenueCatUserId?: string | null;
  hasRevenueCatAccount?: boolean;
}

// Available payment providers - easy to extend
export type PremiumProvider = "stripe" | "paypal" | "lemonsqueezy" | "revenuecat" | "other";

// Plan types for the new 3-plan structure
export type PlanType = "free" | "supporter" | "premium";

// Premium plans - enhanced structure for new fitness-focused pricing
export interface PremiumPlan {
  id: string; // External provider ID (e.g., price_1ABC) or "free" for free plan
  internalId?: string; // Internal database ID
  name: string;
  type: PlanType; // New: plan type
  priceMonthly: number;
  priceYearly: number;
  currency: "EUR" | "USD";
  features: string[];
  description?: string; // New: plan description
  badge?: string; // New: plan badge text
  isPopular?: boolean; // New: mark as most popular
  isRecommended?: boolean; // New: mark as recommended
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

// FAQ item for the new pricing page
export interface FAQItem {
  question: string;
  answer: string;
}

// Testimonial for the new pricing page
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  image?: string;
}

// Feature comparison for detailed table
export interface FeatureComparison {
  category: string;
  features: {
    name: string;
    free: boolean | string; // true/false or text like "6 months"
    supporter: boolean | string;
    premium: boolean | string;
  }[];
}
