import { prisma } from "@/shared/lib/prisma";

import { billingService } from "./billing.service";

import type { PaymentProcessor } from "@prisma/client";
import type { RevenueCatWebhookPayload, StripeWebhookPayload, LemonSqueezyWebhookPayload } from "./billing.types";

export class WebhookService {
  private static instance: WebhookService;

  private constructor() {}

  static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  // ========================================
  // Webhook logging
  // ========================================

  async logWebhook(provider: PaymentProcessor, eventType: string, payload: any, headers?: any, relatedUserId?: string) {
    return await prisma.webhookEvent.create({
      data: {
        provider,
        eventType,
        payload,
        headers,
        relatedUserId,
      },
    });
  }

  // ========================================
  // Asynchronous webhook processing
  // ========================================

  async processWebhook(eventId: string) {
    const event = await prisma.webhookEvent.findUnique({
      where: { id: eventId },
    });

    if (!event || event.processed) return;

    try {
      let result: any;

      switch (event.provider) {
        case "REVENUECAT":
          result = await this.processRevenueCatWebhook(event.payload as unknown as RevenueCatWebhookPayload);
          break;

        case "STRIPE":
          result = await this.processStripeWebhook(event.payload as unknown as StripeWebhookPayload);
          break;

        case "LEMONSQUEEZY":
          result = await this.processLemonSqueezyWebhook(event.payload as unknown as LemonSqueezyWebhookPayload);
          break;

        case "PADDLE":
          result = await this.processPaddleWebhook(event.payload);
          break;

        case "PAYPAL":
          result = await this.processPayPalWebhook(event.payload);
          break;

        default:
          throw new Error(`Unsupported provider: ${event.provider}`);
      }

      // Mark as processed with success
      await prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
          processed: true,
          processedAt: new Date(),
          resultingAction: result?.action,
          relatedPaymentId: result?.paymentId,
        },
      });
    } catch (error) {
      // Handle errors and retries
      await this.handleWebhookError(eventId, error);
    }
  }

  private async handleWebhookError(eventId: string, error: any) {
    const event = await prisma.webhookEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) return;

    const newRetryCount = event.retryCount + 1;
    const shouldRetry = newRetryCount < event.maxRetries;

    await prisma.webhookEvent.update({
      where: { id: eventId },
      data: {
        retryCount: newRetryCount,
        error: error instanceof Error ? error.message : String(error),
        processed: !shouldRetry, // Mark as processed if not retrying
        processedAt: !shouldRetry ? new Date() : undefined,
      },
    });

    if (shouldRetry) {
      console.log(`TODO : Webhook ${eventId} will be retried (${newRetryCount}/${event.maxRetries})`);
    }
  }

  // ========================================
  // Handlers specific to each provider
  // ========================================

  private async processRevenueCatWebhook(payload: RevenueCatWebhookPayload) {
    const { event } = payload;
    const userId = event.app_user_id;

    switch (event.type) {
      case "INITIAL_PURCHASE":
      case "RENEWAL": {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error(`User not found: ${userId}`);

        const plan = await prisma.subscriptionPlan.findFirst({
          where: { revenueCatProductId: event.product_id },
        });
        if (!plan) throw new Error(`Plan not found for product: ${event.product_id}`);

        await billingService.createSubscription({
          userId: user.id,
          planId: plan.id,
          platform: "IOS", // TODO : Deduce from event.environment?
          revenueCatUserId: userId,
          revenueCatEntitlement: event.entitlement_id,
        });

        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPremium: true,
            premiumUntil: event.expiration_at_ms ? new Date(event.expiration_at_ms) : null,
          },
        });

        return { action: "subscription_activated", userId };
      }

      case "CANCELLATION":
      case "EXPIRATION": {
        const subscription = await prisma.subscription.findFirst({
          where: { revenueCatUserId: userId, status: "ACTIVE" },
        });

        if (subscription) {
          await billingService.updateSubscriptionStatus(
            subscription.id,
            event.type === "CANCELLATION" ? "CANCELLED" : "EXPIRED",
            event.expiration_at_ms ? new Date(event.expiration_at_ms) : undefined,
          );
        }

        await prisma.user.update({
          where: { id: userId },
          data: { isPremium: false, premiumUntil: null },
        });

        return { action: "subscription_cancelled", userId };
      }

      default:
        return { action: event.type.toLowerCase(), userId };
    }
  }

  private async processStripeWebhook(payload: StripeWebhookPayload) {
    const { type, data } = payload;

    switch (type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = data.object;
        const customerId = subscription.customer;

        const payment = await prisma.payment.findFirst({
          where: {
            processorPaymentId: customerId,
            processor: "STRIPE",
          },
          include: { subscription: true },
        });

        if (payment?.subscription) {
          await billingService.updateSubscriptionStatus(
            payment.subscription.id,
            subscription.status === "active" ? "ACTIVE" : "PAUSED",
            new Date(subscription.current_period_end * 1000),
          );

          return {
            action: "subscription_updated",
            paymentId: payment.id,
            userId: payment.subscription.userId,
          };
        }
        break;
      }

      case "customer.subscription.deleted": {
        // TODO : Handle subscription deletion
        break;
      }

      case "invoice.payment_succeeded": {
        // TODO : Handle payment success
        break;
      }
    }

    return { action: type };
  }

  private async processLemonSqueezyWebhook(payload: LemonSqueezyWebhookPayload) {
    const { meta, data } = payload;

    switch (meta.event_name) {
      case "subscription_created": {
        const attributes = data.attributes;
        const userEmail = attributes.user_email;

        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (user) {
          const plan = await prisma.subscriptionPlan.findFirst({
            where: { externalProductId: attributes.product_id.toString() },
          });

          if (plan) {
            await billingService.createSubscription({
              userId: user.id,
              planId: plan.id,
              platform: "WEB",
            });

            return { action: "subscription_created", userId: user.id };
          }
        }
        break;
      }

      case "subscription_cancelled": {
        // Gérer l'annulation
        break;
      }

      // Ajouter d'autres cas selon vos besoins
    }

    return { action: meta.event_name };
  }

  private async processPaddleWebhook(_payload: any) {
    // TODO: Implement Paddle webhook handling if needed.
    return { action: "paddle_event" };
  }

  private async processPayPalWebhook(_payload: any) {
    // TODO: Implement PayPal webhook handling if needed.
    return { action: "paypal_event" };
  }

  // ========================================
  // Utilities
  // ========================================

  async getUnprocessedWebhooks(limit = 10) {
    return await prisma.webhookEvent.findMany({
      where: {
        processed: false,
        retryCount: { lt: 3 }, // Moins que maxRetries
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });
  }

  async processUnprocessedWebhooks() {
    const webhooks = await this.getUnprocessedWebhooks();

    for (const webhook of webhooks) {
      await this.processWebhook(webhook.id);
    }
  }
}

export const webhookService = WebhookService.getInstance();
