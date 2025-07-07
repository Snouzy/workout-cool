/**
 * Utilities for handling malformed cookies from the mobile app
 */

/**
 * Cleans malformed cookies from mobile app
 * 
 * Converts: "token=abc,token=xyz" 
 * To: "token=abc; token=xyz"
 * 
 * Also handles:
 * - Duplicate cookie names (keeps better-auth.* cookies)
 * - Trailing commas and whitespace
 */
export function cleanMobileCookies(cookieHeader: string): string {
  if (!cookieHeader) return "";

  // Replace comma separators between better-auth cookies with semicolons
  const cleaned = cookieHeader.replace(/,better-auth\./g, "; better-auth.");

  // Parse and deduplicate cookies
  const cookieMap = new Map<string, string>();

  cleaned.split(";").forEach((cookie) => {
    const trimmed = cookie.trim();
    if (trimmed && trimmed.includes("=")) {
      const [name, ...valueParts] = trimmed.split("=");
      if (name && valueParts.length > 0) {
        const cleanName = name.trim();
        const value = valueParts.join("=").replace(/,\s*$/, "");

        // Prioritize better-auth cookies
        if (cleanName.startsWith("better-auth.")) {
          cookieMap.set(cleanName, value);
        } else if (!cookieMap.has(cleanName)) {
          cookieMap.set(cleanName, value);
        }
      }
    }
  });

  // Reconstruct the cookie header
  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}