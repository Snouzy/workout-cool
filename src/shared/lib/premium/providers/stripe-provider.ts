/* eslint-disable no-case-declarations */
import Stripe from "stripe";
import { PaymentProcessor, PaymentStatus } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { env } from "@/env";

import type { CheckoutResult, PremiumPlan } from "@/shared/types/premium.types";
import type { PaymentProvider, CheckoutOptions, WebhookResult } from "./base-provider";

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
      apiVersion: "2024-04-10",
      typescript: true,
    });
  }

  async createCheckoutSession(userId: string, plan: PremiumPlan, options: CheckoutOptions = {}): Promise<CheckoutResult> {
    try {
      const priceId = plan.id; // External Stripe price ID from provider mapping

      if (!priceId) {
        return {
          success: false,
          error: "Missing Stripe price ID for plan",
          provider: "stripe",
        };
      }

      const session = await this.stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          planId: plan.id,
          internalPlanId: plan.internalId || plan.id,
          ...options.metadata,
        },
        subscription_data: {
          metadata: {
            userId,
            planId: plan.id,
            internalPlanId: plan.internalId || plan.id,
          },
        },
        success_url: options.successUrl || `${env.NEXT_PUBLIC_APP_URL}/profile?payment=success`,
        cancel_url: options.cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/profile?payment=cancelled`,
        customer_email: undefined, // Let Stripe collect email
        allow_promotion_codes: true,
      });

      return {
        success: true,
        checkoutUrl: session.url || undefined,
        provider: "stripe",
      };
    } catch (error) {
      console.error("Stripe checkout error:", error);

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: "stripe",
      };
    }
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      this.stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch (error) {
      console.error("Stripe webhook signature verification failed:", error);
      return false;
    }
  }

  async processWebhook(payload: any, signature: string): Promise<WebhookResult> {
    try {
      const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is required");
      }

      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      console.log(`Processing Stripe event: ${event.type}`);

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("Checkout session completed:", session.id);

          if (typeof session.subscription === "string" && session.metadata?.userId) {
            const subscription = await this.stripe.subscriptions.retrieve(session.subscription);

            const {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              current_period_start,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              current_period_end,
              status,
              id: stripeSubscriptionId,
              items: {
                data: [
                  {
                    price: { id: stripePriceId },
                  },
                ],
              },
            } = subscription;

            // Update or create subscription in database
            await this.updateSubscriptionInDB({
              userId: session.metadata.userId,
              stripeSubscriptionId,
              stripePriceId,
              status,
              currentPeriodStart: current_period_start,
              currentPeriodEnd: current_period_end,
              internalPlanId: session.metadata.internalPlanId,
            });

            return {
              success: true,
              userId: session.metadata.userId,
              planId: stripePriceId,
              platform: "WEB" as const,
              action: "subscription_created",
              expiresAt: new Date(current_period_end * 1000),
            };
          }
          break;

        case "invoice.payment_succeeded":
          const invoice = event.data.object as Stripe.Invoice;
          console.log("Invoice payment succeeded:", {
            invoiceId: invoice.id,
            amount_paid: invoice.amount_paid,
            amount_due: invoice.amount_due,
            customer: invoice.customer,
            subscription: invoice.subscription,
            subscription_details: invoice.subscription_details,
          });

          if (invoice.amount_paid > 0 && typeof invoice.customer === "string") {
            // Find subscription by multiple methods
            let subscription: any = null;

            // Method 1: Direct subscription ID
            if (invoice.subscription) {
              subscription = await this.stripe.subscriptions.retrieve(invoice.subscription as string);
              console.log("Method 1 - Retrieved subscription by ID:", {
                id: subscription.id,
                userId: subscription.metadata?.userId,
                planId: subscription.metadata?.planId,
              });
            }
            // Method 2: Search by customer
            else {
              console.log("Method 2 - Searching subscriptions by customer:", invoice.customer);
              const subscriptions = await this.stripe.subscriptions.list({
                customer: invoice.customer as string,
                status: "all",
                limit: 1,
              });

              if (subscriptions.data.length > 0) {
                subscription = subscriptions.data[0];
                console.log("Method 2 - Found subscription by customer:", {
                  id: subscription.id,
                  userId: subscription.metadata?.userId,
                  planId: subscription.metadata?.planId,
                });
              }
            }

            if (subscription && subscription.metadata?.userId) {
              // Update subscription status to active
              await this.updateSubscriptionStatusInDB(subscription.metadata.userId, "ACTIVE");

              console.log("Creating payment record with:", {
                userId: subscription.metadata.userId,
                planId: subscription.metadata.planId || subscription.items.data[0]?.price.id,
                processorPaymentId: invoice.id,
                amount: (invoice.amount_paid || 0) / 100,
              });

              // Create payment record - use price ID if planId not in metadata
              const paymentResult = await this.createPaymentRecord({
                userId: subscription.metadata.userId,
                planId: subscription.metadata.planId || subscription.items.data[0]?.price.id || "unknown",
                processorPaymentId: invoice.id,
                amount: (invoice.amount_paid || 0) / 100,
                currency: invoice.currency.toUpperCase(),
                status: "COMPLETED",
              });

              console.log("Payment record result:", paymentResult);

              return {
                success: true,
                userId: subscription.metadata.userId,
                planId: subscription.metadata.planId,
                platform: "WEB" as const,
                action: "payment_succeeded",
                expiresAt: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : undefined,
                paymentId: paymentResult?.id,
                amount: (invoice.amount_paid || 0) / 100,
                currency: invoice.currency.toUpperCase(),
              };
            } else {
              console.warn("No subscription found or missing userId in metadata. Customer:", invoice.customer);

              // Fallback: Try to find user by Stripe customer and create payment record
              const user = await this.findUserByStripeCustomer(invoice.customer as string);
              if (user) {
                console.log("Fallback: Found user by customer ID:", user);

                const paymentResult = await this.createPaymentRecord({
                  userId: user.id,
                  planId: "fallback-plan", // We'll handle this in createPaymentRecord
                  processorPaymentId: invoice.id,
                  amount: (invoice.amount_paid || 0) / 100,
                  currency: invoice.currency.toUpperCase(),
                  status: "COMPLETED",
                });

                console.log("Fallback payment record result:", paymentResult);

                return {
                  success: true,
                  userId: user.id,
                  planId: "unknown",
                  platform: "WEB" as const,
                  action: "payment_succeeded",
                  paymentId: paymentResult?.id,
                  amount: (invoice.amount_paid || 0) / 100,
                  currency: invoice.currency.toUpperCase(),
                };
              }
            }
          } else {
            console.log("Skipping payment creation: amount_paid =", invoice.amount_paid, "customer =", invoice.customer);
          }
          break;

        case "invoice.payment_failed":
          const invoiceFailed = event.data.object as Stripe.Invoice;

          if (typeof invoiceFailed.customer === "string") {
            // Find user by customer and update subscription status
            const subscription = await this.findSubscriptionByCustomer(invoiceFailed.customer);
            if (subscription) {
              await this.updateSubscriptionStatusInDB(subscription.userId, "PAUSED");
            }
          }
          break;

        case "customer.subscription.created":
          const createdSub = event.data.object as Stripe.Subscription;

          if (createdSub.metadata?.userId) {
            await this.updateSubscriptionInDB({
              userId: createdSub.metadata.userId,
              stripeSubscriptionId: createdSub.id,
              stripePriceId: createdSub.items.data[0]?.price.id,
              status: createdSub.status,
              currentPeriodStart: createdSub.current_period_start,
              currentPeriodEnd: createdSub.current_period_end,
              internalPlanId: createdSub.metadata.internalPlanId,
            });
          }

          return {
            success: true,
            userId: createdSub.metadata?.userId,
            planId: createdSub.metadata?.planId,
            platform: "WEB" as const,
            action: "subscription_created",
            expiresAt: new Date(createdSub.current_period_end * 1000),
          };

        case "customer.subscription.updated":
          const updatedSub = event.data.object as Stripe.Subscription;

          if (updatedSub.metadata?.userId) {
            await this.updateSubscriptionInDB({
              userId: updatedSub.metadata.userId,
              stripeSubscriptionId: updatedSub.id,
              stripePriceId: updatedSub.items.data[0]?.price.id,
              status: updatedSub.status,
              currentPeriodStart: updatedSub.current_period_start,
              currentPeriodEnd: updatedSub.current_period_end,
              internalPlanId: updatedSub.metadata.internalPlanId,
            });

            // Check if subscription was cancelled
            const action = updatedSub.cancel_at_period_end ? "subscription_cancelled" : "subscription_updated";

            return {
              success: true,
              userId: updatedSub.metadata.userId,
              planId: updatedSub.metadata.planId,
              platform: "WEB" as const,
              action: action as any,
              expiresAt: new Date(updatedSub.current_period_end * 1000),
            };
          }
          break;

        case "customer.subscription.deleted":
          const deletedSub = event.data.object as Stripe.Subscription;

          if (deletedSub.metadata?.userId) {
            await this.updateSubscriptionStatusInDB(deletedSub.metadata.userId, "CANCELLED");
          }

          return {
            success: true,
            userId: deletedSub.metadata?.userId,
            planId: deletedSub.metadata?.planId,
            platform: "WEB" as const,
            action: "subscription_cancelled",
          };

        case "customer.subscription.trial_will_end":
          // Log trial ending - could trigger email notification
          console.log("Trial will end for subscription:", event.data.object);
          return { success: true };

        // Events we acknowledge but don't need to process
        case "charge.succeeded":
        case "customer.created":
        case "customer.updated":
        case "payment_method.attached":
        case "payment_intent.succeeded":
        case "payment_intent.created":
        case "invoice.created":
        case "invoice.finalized":
        case "invoice.paid":
          return { success: true };

        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
          return { success: true };
      }

      // Default return in case no case matches
      return { success: true };
    } catch (error) {
      console.error("Stripe webhook processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Create a Payment record in the database
   */
  private async createPaymentRecord({
    userId,
    planId,
    processorPaymentId,
    amount,
    currency,
    status,
  }: {
    userId: string;
    planId: string;
    processorPaymentId: string;
    amount: number;
    currency: string;
    status: "COMPLETED" | "FAILED";
  }): Promise<{ id: string } | null> {
    console.log("createPaymentRecord called with:", { userId, planId, processorPaymentId, amount, currency, status });

    if (!userId || !planId) {
      console.warn("Missing userId or planId for payment record creation:", { userId, planId });
      return null;
    }

    try {
      // Find the user's active subscription for this plan
      // First try to find by provider mapping
      const planMapping = await prisma.planProviderMapping.findFirst({
        where: {
          externalId: planId,
          provider: "STRIPE",
          isActive: true,
        },
        include: { plan: true },
      });

      console.log("Plan mapping found:", planMapping);

      // Try to find subscription using either mapped plan ID or original plan ID
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          ...(planMapping?.planId ? { planId: planMapping.planId } : {}),
          status: { in: ["ACTIVE", "TRIAL"] }, // Include TRIAL status
        },
        orderBy: { createdAt: "desc" }, // Get most recent subscription
      });

      console.log("Subscription found:", subscription);

      if (!subscription) {
        // If no subscription found with plan mapping, try to find any active subscription for this user
        const anyActiveSubscription = await prisma.subscription.findFirst({
          where: {
            userId,
            status: { in: ["ACTIVE", "TRIAL"] },
          },
          orderBy: { createdAt: "desc" },
        });

        console.log("Any active subscription found:", anyActiveSubscription);

        if (!anyActiveSubscription) {
          console.warn(`No active subscription found for user ${userId}`);
          return null;
        }

        // Use the active subscription we found
        const payment = await prisma.payment.create({
          data: {
            subscriptionId: anyActiveSubscription.id,
            amount,
            currency,
            processor: PaymentProcessor.STRIPE,
            processorPaymentId,
            status: status === "COMPLETED" ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
            paidAt: status === "COMPLETED" ? new Date() : null,
            failedAt: status === "FAILED" ? new Date() : null,
          },
        });

        console.log("Payment created successfully:", payment.id);
        return { id: payment.id };
      }

      const payment = await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount,
          currency,
          processor: PaymentProcessor.STRIPE,
          processorPaymentId,
          status: status === "COMPLETED" ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
          paidAt: status === "COMPLETED" ? new Date() : null,
          failedAt: status === "FAILED" ? new Date() : null,
        },
      });

      console.log("Payment created successfully:", payment.id);
      return { id: payment.id };
    } catch (error) {
      console.error("Error creating payment record:", error);
      return null;
    }
  }

  /**
   * Update subscription in database based on Stripe data
   */
  private async updateSubscriptionInDB({
    userId,
    stripeSubscriptionId,
    stripePriceId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
    internalPlanId,
  }: {
    userId: string;
    stripeSubscriptionId: string;
    stripePriceId?: string;
    status: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    internalPlanId?: string;
  }): Promise<void> {
    try {
      // Map Stripe status to our SubscriptionStatus enum
      let dbStatus: "ACTIVE" | "TRIAL" | "CANCELLED" | "EXPIRED" | "PAUSED";
      switch (status) {
        case "active":
          dbStatus = "ACTIVE";
          break;
        case "trialing":
          dbStatus = "TRIAL";
          break;
        case "canceled":
        case "cancelled":
          dbStatus = "CANCELLED";
          break;
        case "past_due":
        case "unpaid":
          dbStatus = "PAUSED";
          break;
        default:
          dbStatus = "EXPIRED";
      }

      // Find the plan ID to use - prefer internal plan ID from metadata
      let planId = internalPlanId;

      if (!planId && stripePriceId) {
        // Try to find plan by provider mapping
        const mapping = await prisma.planProviderMapping.findFirst({
          where: {
            externalId: stripePriceId,
            provider: "STRIPE",
            isActive: true,
          },
        });
        planId = mapping?.planId;
      }

      if (!planId) {
        // Fallback to default plan
        const defaultPlan = await prisma.subscriptionPlan.findFirst({
          where: { isActive: true },
          orderBy: { priceMonthly: "asc" },
        });
        planId = defaultPlan?.id;
      }

      if (!planId) {
        console.error("No plan found for subscription update");
        return;
      }

      // Update or create subscription
      await prisma.subscription.upsert({
        where: {
          userId_platform: {
            userId,
            platform: "WEB",
          },
        },
        update: {
          status: dbStatus,
          currentPeriodEnd: new Date(currentPeriodEnd * 1000),
          updatedAt: new Date(),
        },
        create: {
          userId,
          planId,
          platform: "WEB",
          status: dbStatus,
          startedAt: new Date(currentPeriodStart * 1000),
          currentPeriodEnd: new Date(currentPeriodEnd * 1000),
        },
      });

      console.log(`Updated subscription for user ${userId} with status ${dbStatus}`);
    } catch (error) {
      console.error("Error updating subscription in DB:", error);
    }
  }

  /**
   * Update subscription status for a user
   */
  private async updateSubscriptionStatusInDB(userId: string, status: "ACTIVE" | "PAUSED" | "CANCELLED"): Promise<void> {
    try {
      await prisma.subscription.updateMany({
        where: {
          userId,
          platform: "WEB",
          status: { in: ["ACTIVE", "TRIAL", "PAUSED"] }, // Only update active subscriptions
        },
        data: {
          status,
          ...(status === "CANCELLED" && { cancelledAt: new Date() }),
        },
      });

      console.log(`Updated subscription status to ${status} for user ${userId}`);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  }

  /**
   * Find user by Stripe customer ID using email matching
   */
  private async findUserByStripeCustomer(stripeCustomerId: string): Promise<{ id: string; email: string } | null> {
    try {
      // Get customer from Stripe
      const customer = await this.stripe.customers.retrieve(stripeCustomerId);

      if (!customer || customer.deleted || !customer.email) {
        console.warn("Customer not found or no email:", stripeCustomerId);
        return null;
      }

      // Find user by email in database
      const user = await prisma.user.findUnique({
        where: { email: customer.email },
        select: { id: true, email: true },
      });

      return user;
    } catch (error) {
      console.error("Error finding user by Stripe customer:", error);
      return null;
    }
  }

  /**
   * Find subscription by Stripe customer ID
   */
  private async findSubscriptionByCustomer(stripeCustomerId: string): Promise<{ userId: string } | null> {
    try {
      // This would require storing Stripe customer ID in your schema
      // For now, we'll return null since the schema doesn't have this field
      console.warn(`Cannot find subscription by customer ID ${stripeCustomerId} - customer ID not stored in schema`);
      return null;
    } catch (error) {
      console.error("Error finding subscription by customer:", error);
      return null;
    }
  }

  /**
   * Create billing portal session for subscription management
   */
  async createBillingPortalSession(userId: string, returnUrl: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // First, we need to find or create a Stripe customer for this user
      // Since customer ID is not in schema, we'll need to create one on-demand
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      // Create or retrieve customer
      const customers = await this.stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      let customerId: string;
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await this.stripe.customers.create({
          email: user.email,
          metadata: { userId },
        });
        customerId = customer.id;
      }

      // Create billing portal session
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return {
        success: true,
        url: session.url,
      };
    } catch (error) {
      console.error("Billing portal creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
