import { NextRequest } from "next/server";

import { auth } from "@/features/auth/lib/better-auth";

/**
 * Cleans malformed cookies from mobile app (Expo)
 *
 * The Expo app sometimes sends cookies with commas instead of semicolons:
 * "token=abc,token=xyz" instead of "token=abc; token=xyz"
 *
 * This function fixes the format and removes duplicates.
 */
function cleanMobileCookies(cookieHeader: string): string {
  if (!cookieHeader) return "";

  // Fix comma-separated cookies (replace ",better-auth." with "; better-auth.")
  const cleaned = cookieHeader.replace(/,better-auth\./g, "; better-auth.");

  // Parse and deduplicate cookies
  const cookieMap = new Map<string, string>();

  cleaned.split(";").forEach((cookie) => {
    const trimmed = cookie.trim();
    if (trimmed && trimmed.includes("=")) {
      const [name, ...valueParts] = trimmed.split("=");
      if (name && valueParts.length > 0) {
        const cleanName = name.trim();
        const value = valueParts.join("=").replace(/,\s*$/, ""); // Remove trailing comma

        // For better-auth cookies, keep the last occurrence (most recent)
        if (cleanName.startsWith("better-auth.")) {
          cookieMap.set(cleanName, value);
        } else if (!cookieMap.has(cleanName)) {
          cookieMap.set(cleanName, value);
        }
      }
    }
  });

  // Reconstruct clean cookie string
  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

/**
 * Gets the authenticated session from a request, handling mobile app cookie issues
 *
 * @param req - The NextRequest object
 * @returns The session object or null if not authenticated
 *
 * @example
 * ```ts
 * export async function GET(req: NextRequest) {
 *   const session = await getMobileCompatibleSession(req);
 *   if (!session) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 *   // Use session.user...
 * }
 * ```
 */
export async function getMobileCompatibleSession(req: NextRequest) {
  const rawCookieHeader = req.headers.get("cookie");

  // If no cookies, no session
  if (!rawCookieHeader) {
    return null;
  }

  // Clean the cookies
  const cleanedCookieHeader = cleanMobileCookies(rawCookieHeader);

  // Create new headers with cleaned cookies
  const cleanHeaders = new Headers(req.headers);
  cleanHeaders.set("cookie", cleanedCookieHeader);

  // Get session with cleaned headers
  const session = await auth.api.getSession({
    headers: cleanHeaders,
  });

  return session;
}

/**
 * Type guard to check if a session has a valid user
 */
export function hasValidUser(session: any): session is { user: { id: string; email: string } } {
  return session?.user?.id && session?.user?.email;
}
