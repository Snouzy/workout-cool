/* eslint-disable no-fallthrough */
import Stripe from "stripe";

import { prisma } from "@/shared/lib/prisma";
import { env } from "@/env";

import type { CheckoutResult, PremiumPlan } from "@/shared/types/premium.types";
import type { CheckoutOptions, PaymentProvider, WebhookResult } from "./base-provider";

/**
 * Stripe Payment Provider
 *
 * Simple implementation of PaymentProvider interface
 * Easy to understand and maintain
 */
export class StripeProvider implements PaymentProvider {
  name = "stripe";
  private stripe: Stripe;

  constructor() {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is required");
    }

    this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    });
  }

  /**
   * Create checkout session for a plan
   */
  async createCheckoutSession(userId: string, plan: PremiumPlan, options?: CheckoutOptions): Promise<CheckoutResult> {
    try {
      // Create or get existing customer
      const customer = await this.getOrCreateCustomer(userId);

      const session = await this.stripe.checkout.sessions.create({
        mode: "subscription",
        // payment_method_types: ["card", "paypal", "apple_pay", "google_pay", "revolut_pay", "samsung_pay", "link", "klarna"],
        customer: customer.id,
        line_items: [
          {
            price: plan.id, // Stripe price ID
            quantity: 1,
          },
        ],
        automatic_tax: {
          enabled: true,
        },
        metadata: {
          userId,
          planId: plan.internalId || plan.id,
          ...options?.metadata,
        },
        subscription_data: {
          metadata: {
            userId,
            planId: plan.internalId || plan.id,
          },
        },
        success_url: options?.successUrl || `${env.NEXT_PUBLIC_APP_URL}/premium?success=true`,
        cancel_url: options?.cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/premium?cancelled=true`,
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        customer_update: {
          name: "auto",
          address: "auto",
        },
        tax_id_collection: {
          enabled: true,
        },
      });

      return {
        success: true,
        checkoutUrl: session.url!,
        provider: "stripe",
      };
    } catch (error) {
      console.error("Stripe checkout session creation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: "stripe",
      };
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      this.stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch (error) {
      console.error("Stripe webhook signature verification failed:", error);
      return false;
    }
  }

  /**
   * Process webhook event
   */
  async processWebhook(payload: string, signature: string): Promise<WebhookResult> {
    try {
      if (!env.STRIPE_WEBHOOK_SECRET) {
        throw new Error("STRIPE_WEBHOOK_SECRET is required");
      }

      const event = this.stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);

      switch (event.type) {
        case "checkout.session.completed": {
          // First payment is successful and the subscription is created | or the subscription was canceled so create new one
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.mode === "subscription" && session.subscription) {
            const subscription = await this.stripe.subscriptions.retrieve(session.subscription as string);

            // Extra: You might want to send a welcome email here
            // Example: await sendEmail.welcome(user.email, subscription);

            // Extra: Track conversion in analytics
            // Example: await analytics.track('subscription_created', { planId, userId });

            return {
              success: true,
              userId: session.metadata?.userId,
              action: "subscription_created",
              expiresAt: new Date(subscription.items.data[0].current_period_end * 1000),
              planId: session.metadata?.planId,
              platform: "WEB",
            };
          }
          break;
        }

        case "invoice.payment_succeeded": {
          // Sent each billing interval when payment succeeds (renewal)
          // Also sent when switching plans if additional payment is needed
          const invoice = event.data.object as Stripe.Invoice;

          if (invoice.parent?.subscription_details?.subscription) {
            const subscription = await this.stripe.subscriptions.retrieve(invoice.parent?.subscription_details?.subscription as string);

            // Extra: Send receipt email
            // Example: await sendEmail.receipt(user.email, invoice);

            // Extra: Update user credits/features if your app uses them
            // Example: await updateUserCredits(userId, plan.credits);

            return {
              success: true,
              userId: subscription.metadata?.userId,
              action: "payment_succeeded",
              expiresAt: new Date(subscription.items.data[0].current_period_end * 1000),
              paymentId: invoice.id,
              amount: invoice.amount_paid / 100, // Convert from cents
              currency: invoice.currency.toUpperCase(),
              platform: "WEB",
            };
          }
          break;
        }

        case "customer.subscription.updated": {
          // Sent when subscription is changed (plan switch, quantity change, etc.)
          // Also sent when subscription renews with a new billing period
          const subscription = event.data.object as Stripe.Subscription;

          // Get the new plan ID from the subscription items
          const newStripePriceId = subscription.items.data[0]?.price?.id;
          let planId = subscription.metadata?.planId;
          console.log("planId:", planId);
          console.log("newStripePriceId:", newStripePriceId);

          // If the price changed, we need to map it to our internal plan ID
          if (newStripePriceId) {
            try {
              // Use the PremiumManager to map Stripe price ID to our internal plan ID
              const { PremiumManager } = await import("@/shared/lib/premium/premium.manager");
              const plan = await PremiumManager.getPlanByExternalId(newStripePriceId, "stripe");
              if (plan) {
                planId = plan.id;
              }
            } catch (error) {
              console.error("Failed to map Stripe price ID to internal plan ID:", error);
              // Fallback to metadata planId if mapping fails
            }
          }

          // Fetch the full subscription object to get all fields
          const fullSubscription = await this.stripe.subscriptions.retrieve(subscription.id);

          return {
            success: true,
            userId: fullSubscription.metadata?.userId,
            action: "subscription_updated",
            expiresAt: new Date(fullSubscription.items.data[0].current_period_end * 1000),
            planId: planId,
            platform: "WEB",
          };
        }

        case "customer.subscription.deleted": {
          // Sent when subscription is cancelled immediately or when it ends after cancel_at_period_end
          const subscription = event.data.object as Stripe.Subscription;

          // Extra: Send cancellation confirmation email
          // Example: await sendEmail.cancelled(user.email);

          // Extra: Revoke premium features immediately or schedule for period end
          // Example: if (subscription.cancel_at_period_end) { scheduleRevoke(userId, subscription.current_period_end) }

          return {
            success: true,
            userId: subscription.metadata?.userId,
            action: "subscription_cancelled",
            platform: "WEB",
          };
        }

        case "invoice.payment_failed": {
          // Sent when payment fails (card declined, insufficient funds, etc.)
          // Stripe will retry based on retry settings (3 times by default)
          const invoice = event.data.object as Stripe.Invoice;

          if (invoice.parent?.subscription_details?.subscription) {
            const subscription = await this.stripe.subscriptions.retrieve(invoice.parent?.subscription_details?.subscription as string);

            // Extra: Send payment failed email with update payment link
            // Example: await sendEmail.paymentFailed(user.email, updatePaymentUrl);

            // Extra: After X failures, you might want to pause premium features
            // Example: if (invoice.attempt_count > 3) { await pausePremiumFeatures(userId) }

            return {
              success: true,
              userId: subscription.metadata?.userId,
              action: "payment_failed",
              paymentId: invoice.id,
              amount: invoice.amount_due / 100,
              currency: invoice.currency.toUpperCase(),
              platform: "WEB",
            };
          }
          break;
        }

        case "customer.created": {
          // Sent when a new customer is created in Stripe
          const customer = event.data.object as Stripe.Customer;
          console.log(`Stripe customer created: ${customer.id}`);
          return { success: true };
        }

        case "checkout.session.expired": {
          // User didn't complete the transaction (abandoned checkout)
          const session = event.data.object as Stripe.Checkout.Session;

          // Extra: Send abandoned cart email to recover the sale
          // Example: await sendEmail.abandonedCart(user.email, checkoutUrl);

          console.log(`Checkout session expired for user: ${session.metadata?.userId}`);
          return { success: true };
        }

        // Informational events - acknowledge without specific action
        case "customer.updated":
        // Sent when customer details are updated (email, address, etc.)
        case "customer.subscription.created":
        // Sent when subscription is first created (we handle via checkout.session.completed)
        case "payment_intent.created":
        // Sent when payment process starts
        case "payment_intent.succeeded":
        // Sent when payment intent succeeds (before invoice.payment_succeeded)
        case "payment_method.attached":
        // Sent when payment method is attached to customer
        case "charge.succeeded":
        // Sent for successful charges (handled via invoice.payment_succeeded for subscriptions)
        case "invoice.created":
        // Sent when invoice is first created (draft state)
        case "invoice.finalized":
        // Sent when invoice is finalized and ready for payment
        case "invoice.updated":
        // Sent when invoice is modified
        case "invoice.paid":
        case "billing_portal.session.created":
        case "invoiceitem.created": {
          // Sent when invoice is marked as paid or portal session created
          console.log(`Acknowledged Stripe event: ${event.type}`);
          return { success: true };
        }

        default:
          console.log(`INFO : Unhandled Stripe event type: ${event.type}`);
      }

      return { success: false, error: "Event type not handled" };
    } catch (error) {
      console.error("Stripe webhook processing failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Create customer portal session
   */
  async createPortalSession(customerId: string, returnUrl?: string): Promise<CheckoutResult> {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || `${env.NEXT_PUBLIC_APP_URL}/premium`,
      });

      return {
        success: true,
        checkoutUrl: session.url,
        provider: "stripe",
      };
    } catch (error) {
      console.error("Stripe portal session creation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: "stripe",
      };
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error("Failed to retrieve Stripe subscription:", error);
      return null;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediately = false): Promise<boolean> {
    try {
      if (immediately) {
        await this.stripe.subscriptions.cancel(subscriptionId);
      } else {
        await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      }
      return true;
    } catch (error) {
      console.error("Failed to cancel Stripe subscription:", error);
      return false;
    }
  }

  /**
   * Get or create Stripe customer for user
   */
  private async getOrCreateCustomer(userId: string): Promise<Stripe.Customer> {
    try {
      // First, check if we have a customer ID stored in our database
      // For simplicity, we'll search by email or create a new customer
      // In production, you'd want to store the customer ID in the database

      // Search for existing customer by metadata
      const customers = await this.stripe.customers.search({
        query: `metadata['userId']:'${userId}'`,
        limit: 1,
      });

      const dbUser = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      if (customers.data.length > 0) {
        return customers.data[0];
      }

      // Create new customer
      return await this.stripe.customers.create({
        email: dbUser.email,
        name: `${dbUser.firstName || "unknown"} ${dbUser.lastName || "unknown"}`,
        metadata: {
          userId,
          first_name: dbUser.firstName,
          last_name: dbUser.lastName,
        },
      });
    } catch (error) {
      console.error("Failed to get or create Stripe customer:", error);
      throw error;
    }
  }

  /**
   * Get customer by user ID
   */
  async getCustomerByUserId(userId: string): Promise<Stripe.Customer | null> {
    try {
      const customers = await this.stripe.customers.search({
        query: `metadata['userId']:'${userId}'`,
        limit: 1,
      });

      return customers.data.length > 0 ? customers.data[0] : null;
    } catch (error) {
      console.error("Failed to get Stripe customer:", error);
      return null;
    }
  }
}
