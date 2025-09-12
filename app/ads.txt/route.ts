import { NextResponse } from "next/server";

export async function GET() {
  // Redirect to Ezoic's ads.txt manager
  // Replace 19390 with your actual Ezoic Account ID if different
  const ezoicAdsUrl = "https://srv.adstxtmanager.com/19390/workout.cool";

  try {
    // Fetch the ads.txt content from Ezoic
    const response = await fetch(ezoicAdsUrl);

    if (response.ok) {
      const adsContent = await response.text();

      // Return the content with proper headers
      return new NextResponse(adsContent, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      });
    }

    // If Ezoic's endpoint fails, fallback to existing Google AdSense entry
    const fallbackContent = "google.com, pub-3437447245301146, DIRECT, f08c47fec0942fa0";

    return new NextResponse(fallbackContent, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    // On error, return the existing Google AdSense entry
    const fallbackContent = "google.com, pub-3437447245301146, DIRECT, f08c47fec0942fa0";

    return new NextResponse(fallbackContent, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
