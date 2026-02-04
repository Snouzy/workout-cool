import { BillingConfig } from "./billing-config";

/**
 * Access control utilities for program sessions
 * Determines user access based on authentication, premium status, and billing mode
 */

export interface AccessControlContext {
  isAuthenticated: boolean;
  isPremium: boolean;
  isSessionPremium: boolean;
}

export type AccessAction =
  | "allow"
  | "require_auth"
  | "require_premium";

/**
 * Determines what action should be taken based on user status and session requirements
 * Respects billing mode for self-hosted instances
 */
export function getSessionAccess(context: AccessControlContext): AccessAction {
  const { isAuthenticated, isPremium, isSessionPremium } = context;

  // Rule 0: If billing is disabled or freemium, grant access to all authenticated users
  if (isAuthenticated && BillingConfig.shouldGrantFreeAccess()) {
    return "allow";
  }

  // Rule 1: Not authenticated -> require auth
  if (!isAuthenticated) {
    return "require_auth";
  }

  // Rule 2: Authenticated + free session -> allow
  if (isAuthenticated && !isSessionPremium) {
    return "allow";
  }

  // Rule 3: Authenticated + premium session + no subscription -> require premium
  if (isAuthenticated && isSessionPremium && !isPremium) {
    return "require_premium";
  }

  // Rule 4: Authenticated + premium session + has subscription -> allow
  if (isAuthenticated && isSessionPremium && isPremium) {
    return "allow";
  }

  // Fallback (should not happen)
  return "require_auth";
}

/**
 * Helper to check if user can start the session
 */
export function canStartSession(context: AccessControlContext): boolean {
  return getSessionAccess(context) === "allow";
}