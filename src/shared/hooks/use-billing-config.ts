"use client";

import { env } from "@/env";

export type BillingMode = "DISABLED" | "LICENSE_KEY" | "SUBSCRIPTION" | "FREEMIUM";

/**
 * Client-side billing configuration hook
 *
 * Provides access to billing mode configuration for UI decisions
 */
export function useBillingConfig() {
  const billingMode: BillingMode = env.NEXT_PUBLIC_BILLING_MODE;

  return {
    billingMode,
    isBillingEnabled: billingMode !== "DISABLED" && billingMode !== "FREEMIUM",
    shouldShowPremiumGates: billingMode !== "DISABLED" && billingMode !== "FREEMIUM",
    shouldGrantFreeAccess: billingMode === "DISABLED" || billingMode === "FREEMIUM",
    shouldShowSubscriptionManagement: billingMode === "SUBSCRIPTION",
    requiresLicenseKey: billingMode === "LICENSE_KEY",
  };
}

/**
 * Standalone helper to get billing mode without using hooks
 * Useful in non-React contexts or server components
 */
export function getBillingMode(): BillingMode {
  return env.NEXT_PUBLIC_BILLING_MODE;
}

/**
 * Check if billing is enabled (not DISABLED or FREEMIUM)
 */
export function isBillingEnabled(): boolean {
  const mode = getBillingMode();
  return mode !== "DISABLED" && mode !== "FREEMIUM";
}

/**
 * Check if premium gates should be shown
 */
export function shouldShowPremiumGates(): boolean {
  return isBillingEnabled();
}

/**
 * Check if all users should get free premium access
 */
export function shouldGrantFreeAccess(): boolean {
  const mode = getBillingMode();
  return mode === "DISABLED" || mode === "FREEMIUM";
}
