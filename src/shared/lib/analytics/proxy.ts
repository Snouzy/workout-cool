import { waitUntil } from "@vercel/functions";
import { OpenPanel, type TrackProperties } from "@openpanel/nextjs";

/**
 * Server-side tracking from proxy.ts, where next/headers (and so setupAnalytics) is not available.
 * Reads process.env directly so the proxy bundle stays free of the env schema.
 */
export function trackFromProxy(options: { event: string } & TrackProperties) {
  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
  if (!clientId) return;

  if (process.env.NODE_ENV !== "production") {
    console.log("Track", options);
    return;
  }

  const { event, ...properties } = options;
  const client = new OpenPanel({ clientId, clientSecret: process.env.OPENPANEL_SECRET_KEY });

  waitUntil(client.track(event, properties));
}
