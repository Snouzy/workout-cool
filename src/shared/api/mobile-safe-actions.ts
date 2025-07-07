import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

import { auth } from "@/features/auth/lib/better-auth";

import { ActionError } from "./safe-actions";

/**
 * Cleans malformed cookies from mobile app (same as in mobile-auth.ts)
 */
function cleanMobileCookies(cookieHeader: string): string {
  if (!cookieHeader) return "";

  const cleaned = cookieHeader.replace(/,better-auth\./g, "; better-auth.");
  const cookieMap = new Map<string, string>();

  cleaned.split(";").forEach((cookie) => {
    const trimmed = cookie.trim();
    if (trimmed && trimmed.includes("=")) {
      const [name, ...valueParts] = trimmed.split("=");
      if (name && valueParts.length > 0) {
        const cleanName = name.trim();
        const value = valueParts.join("=").replace(/,\s*$/, "");

        if (cleanName.startsWith("better-auth.")) {
          cookieMap.set(cleanName, value);
        } else if (!cookieMap.has(cleanName)) {
          cookieMap.set(cleanName, value);
        }
      }
    }
  });

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

/**
 * Gets the authenticated user from headers, handling mobile app cookie issues
 */
async function getMobileCompatibleUser() {
  const headersList = await headers();
  const rawCookieHeader = headersList.get("cookie");

  if (!rawCookieHeader) {
    throw new ActionError("Session not found!");
  }

  // Clean the cookies
  const cleanedCookieHeader = cleanMobileCookies(rawCookieHeader);

  // Create new headers with cleaned cookies
  const cleanHeaders = new Headers(headersList);
  cleanHeaders.set("cookie", cleanedCookieHeader);

  // Get session with cleaned headers
  const session = await auth.api.getSession({
    headers: cleanHeaders,
  });

  if (!session?.user) {
    throw new ActionError("Session not found!");
  }

  if (!session.user.id || !session.user.email) {
    throw new ActionError("Session is not valid!");
  }

  return session.user;
}

/**
 * Safe action client that handles mobile app authentication issues
 *
 * Use this instead of authenticatedActionClient for actions that need to work
 * with the mobile app.
 *
 * @example
 * ```ts
 * export const updateUserAction = mobileAuthenticatedActionClient
 *   .schema(updateUserSchema)
 *   .action(async ({ parsedInput, ctx }) => {
 *     const { user } = ctx;
 *     // user is guaranteed to be authenticated
 *   });
 * ```
 */
export const mobileAuthenticatedActionClient = createSafeActionClient({
  handleServerError: (e: Error) => {
    if (e instanceof ActionError) {
      return e.message;
    }
    return "An unexpected error occurred.";
  },
}).use(async ({ next }: { next: any }) => {
  const user = await getMobileCompatibleUser();
  return await next({ ctx: { user } });
});
