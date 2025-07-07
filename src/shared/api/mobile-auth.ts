import { NextRequest } from "next/server";

import { auth } from "@/features/auth/lib/better-auth";

import { cleanMobileCookies } from "./mobile-cookie-utils";

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
