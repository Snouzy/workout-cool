import { NextRequest, NextResponse } from "next/server";

import { LogEvents } from "@/shared/lib/analytics/events";

/**
 * POST /api/analytics/premium
 *
 * Track premium-related analytics events from mobile app
 * Mobile-compatible endpoint for tracking user interactions with premium features
 */
export async function POST(request: NextRequest) {
  try {
    const { event } = await request.json();

    // Validate event type
    const validEvents = ["discovery", "paywall_viewed", "paywall_purchased", "paywall_cancelled", "paywall_restored"];

    if (!validEvents.includes(event)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // Map event types to analytics events
    let analyticsEvent;
    switch (event) {
      case "discovery":
        analyticsEvent = LogEvents.PremiumDiscovery;
        break;
      case "paywall_viewed":
        analyticsEvent = LogEvents.PaywallViewed;
        break;
      case "paywall_purchased":
        analyticsEvent = LogEvents.PaywallPurchased;
        break;
      case "paywall_cancelled":
        analyticsEvent = LogEvents.PaywallCancelled;
        break;
      case "paywall_restored":
        analyticsEvent = LogEvents.PaywallRestored;
        break;
      default:
        return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
    }

    // todo: add analytics
    // Track event with user context if available
    // if (user) {
    //   await serverAnalytics.event({
    //     eventName: analyticsEvent.name,
    //     channel: analyticsEvent.channel,
    //     user: {
    //       id: user.id,
    //       email: user.email || undefined,
    //     },
    //     metadata: {
    //       ...metadata,
    //       source: "mobile",
    //       timestamp: new Date().toISOString(),
    //     },
    //   });
    // } else {
    //   // Track anonymous event
    //   await serverAnalytics.event({
    //     eventName: analyticsEvent.name,
    //     channel: analyticsEvent.channel,
    //     metadata: {
    //       ...metadata,
    //       source: "mobile",
    //       anonymous: true,
    //       timestamp: new Date().toISOString(),
    //     },
    //   });
    // }

    return NextResponse.json({ event, analyticsEvent, success: true });
  } catch (error) {
    console.error("Error tracking premium analytics:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
