import type { CheckoutResult, PremiumPlan } from "@/shared/types/premium.types";

/**
 * Base Payment Provider Interface
 *
 * KISS approach: Simple interface that any provider can implement
 * Easy to switch between Stripe, LemonSqueezy, PayPal, etc.
 */
export interface PaymentProvider {
  name: string;

  /**
   * Create checkout session for a plan
   */
  createCheckoutSession(userId: string, plan: PremiumPlan, options?: CheckoutOptions): Promise<CheckoutResult>;

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;

  /**
   * Process webhook event
   */
  processWebhook(payload: any, signature: string): Promise<WebhookResult>;
}

export interface CheckoutOptions {
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface WebhookResult {
  success: boolean;
  userId?: string;
  action?: "subscription_created" | "subscription_updated" | "subscription_cancelled" | "payment_succeeded" | "payment_failed";
  expiresAt?: Date;
  planId?: string;
  platform?: "WEB" | "IOS" | "ANDROID";
  paymentId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}
