import { env } from "@/env";

/**
 * RevenueCat Configuration Service
 *
 * Centralized configuration for RevenueCat integration
 * Follows KISS principle - simple and easy to maintain
 */
export class RevenueCatConfig {
  /**
   * Get RevenueCat secret key for API calls
   */
  static getSecretKey(): string {
    const secretKey = env.REVENUECAT_SECRET_KEY;
    if (!secretKey) {
      throw new Error("REVENUECAT_SECRET_KEY environment variable is required");
    }
    return secretKey;
  }

  /**
   * Get RevenueCat webhook secret for signature validation
   */
  static getWebhookSecret(): string {
    const webhookSecret = env.REVENUECAT_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("REVENUECAT_WEBHOOK_SECRET environment variable is required");
    }
    return webhookSecret;
  }

  /**
   * Check if RevenueCat is properly configured
   */
  static isConfigured(): boolean {
    return !!(env.REVENUECAT_SECRET_KEY && env.REVENUECAT_WEBHOOK_SECRET);
  }

  /**
   * Get RevenueCat API base URL
   */
  static getApiBaseUrl(): string {
    return "https://api.revenuecat.com/v2";
  }

  /**
   * Get common headers for RevenueCat API requests
   */
  static getApiHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.getSecretKey()}`,
      "X-Platform": "server",
    };
  }

  /**
   * Get webhook validation settings
   */
  static getWebhookConfig() {
    return {
      secret: this.getWebhookSecret(),
      tolerance: 300, // 5 minutes tolerance for timestamp validation
    };
  }

  /**
   * Development mode helpers
   */
  static isDevelopment(): boolean {
    return env.NODE_ENV === "development";
  }

  /**
   * Get sandbox mode setting based on environment
   */
  static isSandbox(): boolean {
    return env.NODE_ENV !== "production";
  }
}
