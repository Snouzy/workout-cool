import { RevenueCatConfig } from "./revenuecat.config";

/**
 * RevenueCat API Client
 * 
 * Provides methods to interact with RevenueCat's REST API
 * Handles authentication, error handling, and response parsing
 */

export interface RevenueCatSubscriber {
  object: "subscriber";
  app_user_id: string;
  original_app_user_id: string;
  entitlements: {
    [key: string]: {
      expires_date: string | null;
      grace_period_expires_date: string | null;
      product_identifier: string;
      purchase_date: string;
      billing_issues_detected_at: string | null;
      owns_product: boolean;
      period_type: "normal" | "trial" | "intro";
      store: "app_store" | "mac_app_store" | "play_store" | "stripe" | "promotional";
      unsubscribe_detected_at: string | null;
      auto_renew_status: boolean;
      is_sandbox: boolean;
    };
  };
  first_seen: string;
  last_seen: string;
  management_url: string | null;
  non_subscriptions: {
    [key: string]: Array<{
      id: string;
      is_sandbox: boolean;
      original_purchase_date: string;
      purchase_date: string;
      store: string;
    }>;
  };
  original_application_version: string | null;
  original_purchase_date: string | null;
  other_purchases: {
    [key: string]: {
      purchase_date: string;
    };
  };
  subscriptions: {
    [key: string]: {
      auto_renew_status: boolean;
      billing_issues_detected_at: string | null;
      expires_date: string | null;
      grace_period_expires_date: string | null;
      is_sandbox: boolean;
      original_purchase_date: string;
      ownership_type: "PURCHASED" | "FAMILY_SHARED";
      period_type: "normal" | "trial" | "intro";
      product_identifier: string;
      purchase_date: string;
      refunded_at: string | null;
      store: "app_store" | "mac_app_store" | "play_store" | "stripe" | "promotional";
      unsubscribe_detected_at: string | null;
    };
  };
}

export interface RevenueCatApiError {
  message: string;
  code: number;
  more_info?: string;
}

export class RevenueCatApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = RevenueCatConfig.getApiBaseUrl();
    this.headers = RevenueCatConfig.getApiHeaders();
  }

  /**
   * Fetch subscriber information from RevenueCat
   * @param appUserId - The RevenueCat app user ID
   * @returns Promise<RevenueCatSubscriber | null>
   */
  async getSubscriber(appUserId: string): Promise<RevenueCatSubscriber | null> {
    try {
      const url = `${this.baseUrl}/subscribers/${encodeURIComponent(appUserId)}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });

      if (response.status === 404) {
        // Subscriber not found - this is expected for new users
        return null;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `RevenueCat API error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData: RevenueCatApiError = JSON.parse(errorBody);
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If error body is not JSON, use the default message
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.subscriber as RevenueCatSubscriber;

    } catch (error) {
      console.error("Error fetching RevenueCat subscriber:", error);
      
      // Re-throw the error to be handled by the calling code
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("Failed to fetch RevenueCat subscriber information");
    }
  }

  /**
   * Check if a subscriber has active entitlements
   * @param appUserId - The RevenueCat app user ID
   * @returns Promise<boolean>
   */
  async hasActiveEntitlements(appUserId: string): Promise<boolean> {
    try {
      const subscriber = await this.getSubscriber(appUserId);
      
      if (!subscriber) {
        return false;
      }

      // Check if any entitlements are active
      const entitlements = subscriber.entitlements;
      const now = new Date();

      for (const [, entitlement] of Object.entries(entitlements)) {
        if (entitlement.owns_product) {
          // Check if entitlement is not expired
          if (!entitlement.expires_date) {
            // No expiration date means lifetime or active subscription
            return true;
          }

          const expiresAt = new Date(entitlement.expires_date);
          if (expiresAt > now) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error("Error checking RevenueCat entitlements:", error);
      // In case of API error, assume no active entitlements
      return false;
    }
  }

  /**
   * Get the most recent expiration date from active entitlements
   * @param appUserId - The RevenueCat app user ID
   * @returns Promise<Date | null>
   */
  async getLatestExpirationDate(appUserId: string): Promise<Date | null> {
    try {
      const subscriber = await this.getSubscriber(appUserId);
      
      if (!subscriber) {
        return null;
      }

      const entitlements = subscriber.entitlements;
      const now = new Date();
      let latestExpiration: Date | null = null;

      for (const [, entitlement] of Object.entries(entitlements)) {
        if (entitlement.owns_product) {
          if (!entitlement.expires_date) {
            // No expiration date means lifetime subscription
            return null;
          }

          const expiresAt = new Date(entitlement.expires_date);
          if (expiresAt > now) {
            if (!latestExpiration || expiresAt > latestExpiration) {
              latestExpiration = expiresAt;
            }
          }
        }
      }

      return latestExpiration;
    } catch (error) {
      console.error("Error getting RevenueCat expiration date:", error);
      return null;
    }
  }

  /**
   * Get active entitlement IDs for a subscriber
   * @param appUserId - The RevenueCat app user ID
   * @returns Promise<string[]>
   */
  async getActiveEntitlementIds(appUserId: string): Promise<string[]> {
    try {
      const subscriber = await this.getSubscriber(appUserId);
      
      if (!subscriber) {
        return [];
      }

      const entitlements = subscriber.entitlements;
      const now = new Date();
      const activeEntitlements: string[] = [];

      for (const [entitlementId, entitlement] of Object.entries(entitlements)) {
        if (entitlement.owns_product) {
          // Check if entitlement is not expired
          if (!entitlement.expires_date) {
            activeEntitlements.push(entitlementId);
          } else {
            const expiresAt = new Date(entitlement.expires_date);
            if (expiresAt > now) {
              activeEntitlements.push(entitlementId);
            }
          }
        }
      }

      return activeEntitlements;
    } catch (error) {
      console.error("Error getting RevenueCat active entitlements:", error);
      return [];
    }
  }
}

// Export a singleton instance
export const revenueCatApi = new RevenueCatApiClient();