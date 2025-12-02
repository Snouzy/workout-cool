import { env } from "@/env";

/**
 * Billing mode options for self-hosted instances
 */
export type BillingMode = "DISABLED" | "LICENSE_KEY" | "SUBSCRIPTION" | "FREEMIUM";

/**
 * Centralized billing configuration service
 *
 * This service provides a single source of truth for billing-related decisions
 * across the application, supporting self-hosted instances with different billing modes.
 */
export class BillingConfig {
  /**
   * Get the current billing mode from environment configuration
   */
  static getBillingMode(): BillingMode {
    return env.DEFAULT_BILLING_MODE;
  }

  /**
   * Check if billing/premium features are enabled
   *
   * @returns false if billing is DISABLED or FREEMIUM, true otherwise
   */
  static isBillingEnabled(): boolean {
    const mode = this.getBillingMode();
    return mode !== "DISABLED" && mode !== "FREEMIUM";
  }

  /**
   * Check if premium gates should be shown in the UI
   *
   * @returns true if premium gates/locks should be displayed
   */
  static shouldShowPremiumGates(): boolean {
    return this.isBillingEnabled();
  }

  /**
   * Check if all users should be granted free premium access
   *
   * @returns true if billing is DISABLED or FREEMIUM (all users get premium features)
   */
  static shouldGrantFreeAccess(): boolean {
    const mode = this.getBillingMode();
    return mode === "DISABLED" || mode === "FREEMIUM";
  }

  /**
   * Check if subscription management features should be shown
   *
   * @returns true if users can manage subscriptions
   */
  static shouldShowSubscriptionManagement(): boolean {
    const mode = this.getBillingMode();
    return mode === "SUBSCRIPTION";
  }

  /**
   * Check if license key features should be enabled
   *
   * @returns true if license key validation is required
   */
  static requiresLicenseKey(): boolean {
    const mode = this.getBillingMode();
    return mode === "LICENSE_KEY";
  }

  /**
   * Determine if a user should have premium access based on billing mode
   *
   * @param userIsPremium - The user's isPremium flag from the database
   * @returns true if the user should have premium access
   */
  static userHasPremiumAccess(userIsPremium: boolean): boolean {
    // If billing is disabled or freemium, all users get premium access
    if (this.shouldGrantFreeAccess()) {
      return true;
    }

    // Otherwise, check the user's premium status
    return userIsPremium;
  }

  /**
   * Determine if content should be accessible based on billing mode
   *
   * @param contentIsPremium - Whether the content is marked as premium
   * @param userIsPremium - The user's isPremium flag from the database
   * @returns true if the content should be accessible
   */
  static canAccessContent(contentIsPremium: boolean, userIsPremium: boolean): boolean {
    // If billing is disabled or freemium, all content is accessible
    if (this.shouldGrantFreeAccess()) {
      return true;
    }

    // If content is not premium, it's always accessible
    if (!contentIsPremium) {
      return true;
    }

    // Premium content requires premium user status
    return userIsPremium;
  }

  /**
   * Check if ads should be shown to the user
   *
   * @param userIsPremium - The user's isPremium flag from the database
   * @returns true if ads should be shown
   */
  static shouldShowAds(userIsPremium: boolean): boolean {
    // If billing is disabled, treat all users as premium (no ads)
    if (this.getBillingMode() === "DISABLED") {
      return false;
    }

    // Otherwise, show ads to non-premium users
    return !this.userHasPremiumAccess(userIsPremium);
  }
}
