"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { adOverlayPolicyKey, getAdOverlayPolicy, parseAdOverlayPolicyKey, removesAnOverlay } from "./overlay-policy";

interface EzoicOverlayApi {
  cmd?: Array<() => void>;
  config?: (options: { disableVideo?: boolean }) => void;
  setEzoicAnchorAd?: (allowed: boolean) => void;
  setOutstreamAllowed?: (allowed: boolean, options?: { reason?: string }) => void;
  setInterstitialAllowed?: (allowed: boolean, options?: { reason?: string }) => void;
  destroyAll?: () => void;
  showAds?: () => void;
}

declare global {
  interface Window {
    /** Overlay policy in force, written by the AdScripts bootstrap and by this component. */
    __wcAdOverlayKey?: string;
  }
}

/**
 * AdScripts applies the overlay policy of the page the visitor lands on. This keeps it in step with
 * client-side navigation: going from a tool page to an app screen removes the anchor ad and the
 * floating video already on screen.
 */
export function AdOverlayRouteSync() {
  const pathname = usePathname();

  useEffect(() => {
    const ezoic = window.ezstandalone as unknown as EzoicOverlayApi | undefined;
    // No command queue: the ad scripts are not on the page (premium user, ads switched off).
    if (!ezoic?.cmd) return;

    const policy = getAdOverlayPolicy(pathname, window.innerWidth);
    const key = adOverlayPolicyKey(policy);

    ezoic.cmd.push(() => {
      if (window.__wcAdOverlayKey === key) return;

      const previous = parseAdOverlayPolicyKey(window.__wcAdOverlayKey);
      window.__wcAdOverlayKey = key;

      ezoic.config?.({ disableVideo: !policy.video });
      ezoic.setEzoicAnchorAd?.(policy.anchor);
      ezoic.setOutstreamAllowed?.(policy.video, { reason: "app-screen" });
      ezoic.setInterstitialAllowed?.(policy.interstitial, { reason: "app-screen" });

      // The switches only stop new requests. An overlay already displayed stays until every ad is
      // destroyed; showAds() then refills the in-page placeholders, without the overlays.
      if (removesAnOverlay(previous, policy)) {
        ezoic.destroyAll?.();
        ezoic.showAds?.();
      }
    });
  }, [pathname]);

  return null;
}
