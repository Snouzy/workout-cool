import { env } from "@/env";

/**
 * Check if Google OAuth is enabled by verifying both required environment variables are set
 * @returns true if Google OAuth is enabled, false otherwise
 */
export function isGoogleOAuthEnabled(): boolean {
  return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}
