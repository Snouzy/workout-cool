import type { SubscriptionPlan, Subscription, Payment, License, BillingMode, PaymentProcessor, Platform } from "@prisma/client";

// ========================================
// Configuration Types
// ========================================

export interface BillingConfig {
  mode: BillingMode;
  processor?: PaymentProcessor;
  limits?: UserLimits;
}

export interface UserLimits {
  maxWorkouts: number;
  maxExercises: number;
  premiumExercises: boolean;
  canTrackWorkouts: boolean;
}

// ========================================
// Plan Types
// ========================================

export interface PlanFeatures {
  maxWorkouts?: number;
  maxExercises?: number;
  premiumExercises?: boolean;
  advancedAnalytics?: boolean;
  customWorkouts?: boolean;
  offlineMode?: boolean;
  prioritySupport?: boolean;
  [key: string]: any;
}

export interface PlanWithFeatures extends SubscriptionPlan {
  features: PlanFeatures;
}

// ========================================
// Subscription Types
// ========================================

export interface SubscriptionWithPlan extends Subscription {
  plan: SubscriptionPlan;
  payments?: Payment[];
}

export interface CreateSubscriptionInput {
  userId: string;
  planId: string;
  platform: Platform;
  processor?: PaymentProcessor;
  externalId?: string;
}

// ========================================
// Payment Types
// ========================================

export interface CreatePaymentInput {
  subscriptionId: string;
  amount: number;
  currency: string;
  processor: PaymentProcessor;
  processorPaymentId?: string;
  metadata?: Record<string, any>;
}

// ========================================
// License Types
// ========================================

export interface LicenseFeatures {
  maxUsers?: number;
  expiresAt?: Date;
  features?: Record<string, any>;
}

export interface CreateLicenseInput {
  key: string;
  validUntil?: Date;
  maxUsers?: number;
  features?: LicenseFeatures;
}

// ========================================
// Webhook Types
// ========================================

// RevenueCat specific
export interface RevenueCatWebhookPayload {
  api_version: string;
  event: {
    type: RevenueCatEventType;
    id: string;
    app_user_id: string;
    product_id: string;
    entitlement_id?: string;
    period_type?: "TRIAL" | "INTRO" | "NORMAL";
    purchased_at_ms: number;
    expiration_at_ms?: number;
    environment: "SANDBOX" | "PRODUCTION";
  };
}

export type RevenueCatEventType =
  | "INITIAL_PURCHASE"
  | "RENEWAL"
  | "CANCELLATION"
  | "UNCANCELLATION"
  | "EXPIRATION"
  | "BILLING_ISSUE"
  | "PRODUCT_CHANGE";

// Stripe specific
export interface StripeWebhookPayload {
  id: string;
  object: string;
  type: StripeEventType;
  data: {
    object: any;
  };
}

export type StripeEventType =
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.payment_succeeded"
  | "invoice.payment_failed";

// LemonSqueezy specific
export interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: LemonSqueezyEventType;
    webhook_id: string;
  };
  data: {
    type: string;
    id: string;
    attributes: any;
  };
}

export type LemonSqueezyEventType =
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_payment_success"
  | "subscription_payment_failed";

// ========================================
// API Response Types
// ========================================

export interface BillingStatus {
  isPremium: boolean;
  subscription?: SubscriptionWithPlan;
  license?: License;
  limits: UserLimits;
  canUpgrade: boolean;
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
  processor: PaymentProcessor;
}

export interface UpgradeOptions {
  plans: PlanWithFeatures[];
  currentPlan?: SubscriptionPlan;
  recommendedPlan?: SubscriptionPlan;
}
