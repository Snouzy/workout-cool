import { NextRequest, NextResponse } from "next/server";

import { PremiumManager } from "@/shared/lib/premium/premium.manager";

/**
 * Detect user region - Platform agnostic approach
 * Works with Vercel, Cloudflare, or any other hosting
 */
function detectUserRegion(request: NextRequest): string {
  console.log("🔍 === DETECTION DE REGION (Platform Agnostic) ===");

  // 1. Try multiple possible geo headers (works with various services)
  const geoHeaders = {
    country:
      request.headers.get("x-vercel-ip-country") || // Vercel
      request.headers.get("cf-ipcountry") || // Cloudflare
      request.headers.get("x-country-code") || // Generic
      request.headers.get("x-real-ip-country"), // Nginx
    region:
      request.headers.get("x-vercel-ip-country-region") || // Vercel
      request.headers.get("cf-region-code"), // Cloudflare
    city:
      request.headers.get("x-vercel-ip-city") || // Vercel
      request.headers.get("cf-city"), // Cloudflare
  };

  console.log("📍 Headers géo détectés:");
  console.log("  - Country:", geoHeaders.country || "non détecté");
  console.log("  - Region:", geoHeaders.region || "non détecté");
  console.log("  - City:", geoHeaders.city || "non détecté");

  // 2. Country-based detection (if available)
  if (geoHeaders.country) {
    const country = geoHeaders.country.toUpperCase();

    // US and Canada -> US region
    if (["US", "CA"].includes(country)) {
      console.log("🏷️ => Région: US (Amériques)");
      return "US";
    }

    // UK
    if (country === "GB") {
      console.log("🏷️ => Région: UK");
      return "UK";
    }

    // Brazil special case
    if (country === "BR") {
      console.log("🏷️ => Région: BR (Brésil)");
      return "BR";
    }

    // Russia
    if (country === "RU") {
      console.log("🏷️ => Région: RU (Russie)");
      return "RU";
    }

    // China
    if (["CN", "HK", "TW"].includes(country)) {
      console.log("🏷️ => Région: CN (Chine)");
      return "CN";
    }

    // Latin America (Spanish/Portuguese speaking, except Brazil)
    const latamCountries = ["MX", "AR", "CL", "CO", "PE", "VE", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY"];
    if (latamCountries.includes(country)) {
      console.log("🏷️ => Région: LATAM (Amérique Latine)");
      return "LATAM";
    }

    // EU countries
    const euCountries = ["FR", "DE", "IT", "ES", "PT", "NL", "BE", "PL", "SE", "DK", "FI", "NO", "AT", "CH", "IE"];
    if (euCountries.includes(country)) {
      console.log("🏷️ => Région: EU (Europe)");
      return "EU";
    }
  }

  // 3. Fallback: Accept-Language header (always available)
  const acceptLanguage = request.headers.get("accept-language");
  console.log("🗣️ Accept-Language:", acceptLanguage);

  if (acceptLanguage) {
    const primaryLang = acceptLanguage.split(",")[0].toLowerCase();

    // US English speakers
    if (primaryLang.includes("en-us")) {
      console.log("🏷️ => Région via langue: US");
      return "US";
    }

    // UK English speakers
    if (primaryLang.includes("en-gb")) {
      console.log("🏷️ => Région via langue: UK");
      return "UK";
    }

    // Portuguese (Brazilian)
    if (primaryLang.includes("pt-br")) {
      console.log("🏷️ => Région via langue: BR");
      return "BR";
    }

    // Spanish speakers (Latin America)
    if (primaryLang.includes("es") && !primaryLang.includes("es-es")) {
      console.log("🏷️ => Région via langue: LATAM");
      return "LATAM";
    }

    // Russian
    if (primaryLang.includes("ru")) {
      console.log("🏷️ => Région via langue: RU");
      return "RU";
    }

    // Chinese
    if (primaryLang.includes("zh")) {
      console.log("🏷️ => Région via langue: CN");
      return "CN";
    }

    // European languages
    if (primaryLang.match(/^(fr|de|it|es-es|pt-pt|nl|pl|sv|da|fi|no)/)) {
      console.log("🏷️ => Région via langue: EU");
      return "EU";
    }
  }

  // 4. Time zone detection fallback (client-side would be needed)
  // Could be passed as a query param from frontend
  const timezone = request.nextUrl.searchParams.get("tz");
  if (timezone) {
    console.log("🕐 Timezone fourni:", timezone);

    // Brazil
    if (timezone.includes("America/Sao_Paulo") || timezone.includes("America/Brasilia")) {
      console.log("🏷️ => Région via timezone: BR");
      return "BR";
    }

    // Latin America
    if (
      timezone.includes("America/Mexico_City") ||
      timezone.includes("America/Buenos_Aires") ||
      timezone.includes("America/Santiago") ||
      timezone.includes("America/Bogota") ||
      timezone.includes("America/Lima")
    ) {
      console.log("🏷️ => Région via timezone: LATAM");
      return "LATAM";
    }

    // US/Canada
    if (timezone.includes("America/") && !timezone.includes("America/Sao_Paulo") && !timezone.includes("America/Mexico_City")) {
      console.log("🏷️ => Région via timezone: US");
      return "US";
    }

    // UK
    if (timezone === "Europe/London") {
      console.log("🏷️ => Région via timezone: UK");
      return "UK";
    }

    // Russia (multiple timezones!)
    if (
      timezone.includes("Europe/Moscow") ||
      timezone.includes("Europe/Samara") ||
      timezone.includes("Asia/Yekaterinburg") ||
      timezone.includes("Asia/Novosibirsk") ||
      timezone.includes("Asia/Vladivostok") ||
      timezone.includes("Europe/Kaliningrad")
    ) {
      console.log("🏷️ => Région via timezone: RU");
      return "RU";
    }

    // China (single timezone)
    if (timezone.includes("Asia/Shanghai") || timezone.includes("Asia/Hong_Kong") || timezone.includes("Asia/Taipei")) {
      console.log("🏷️ => Région via timezone: CN");
      return "CN";
    }

    // Europe
    if (timezone.includes("Europe/")) {
      console.log("🏷️ => Région via timezone: EU");
      return "EU";
    }

    // Additional Asia-Pacific that might use USD
    if (timezone.includes("Asia/Tokyo") || timezone.includes("Australia/") || timezone.includes("Pacific/")) {
      console.log("🏷️ => Région via timezone: US (Asia-Pacific default)");
      return "US";
    }
  }

  // Default
  console.log("🏷️ => Région par défaut: EU");
  console.log("=========================\n");
  return "EU";
}

/**
 * GET /api/premium/plans
 *
 * Get available premium plans with optional provider/region filtering
 * Query params: provider, region, tz (timezone)
 * Public endpoint - no auth required
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider") || undefined;

    // Use provided region or auto-detect
    let region = searchParams.get("region") || undefined;
    if (!region) {
      region = detectUserRegion(request);
    } else {
      console.log("📍 Région fournie explicitement:", region);
    }

    const plans = await PremiumManager.getAvailablePlans(provider, region);
    console.log(`\n✅ Retour de ${plans.length} plan(s) pour la région: ${region}\n`);

    // Include debug info only in development
    const response: any = {
      plans,
      detectedRegion: region,
    };

    if (process.env.NODE_ENV === "development") {
      response.debug = {
        headers: {
          country: request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry"),
          acceptLanguage: request.headers.get("accept-language"),
          timezone: searchParams.get("tz"),
        },
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching plans:", error);

    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
