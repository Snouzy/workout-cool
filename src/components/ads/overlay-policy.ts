/**
 * Which automatic overlay ad formats may show on a page. These are the formats Ezoic places by
 * itself on top of the page: the anchor ad docked to the bottom, the video players (the floating
 * one, and the one inserted in the content, which detaches and floats once scrolled past) and the
 * full-screen interstitial. In-page banners and the rewarded ad are not concerned.
 *
 * App screens (workout builder, session, programs, statistics, leaderboard, profile) have a fixed
 * bottom navigation and fixed action buttons, and an overlay ad lands exactly on them: no overlay
 * there. Tool pages are articles, so they keep the anchor ad and the interstitial, and the floating
 * video only on a screen wide enough to leave the navigation clear.
 */
export interface AdOverlayPolicy {
  anchor: boolean;
  video: boolean;
  interstitial: boolean;
}

/**
 * Keep this function free of imports and closures: AdScripts serialises it into the
 * page (`toString()`), so the same rule also runs before hydration, when Ezoic starts.
 */
export function getAdOverlayPolicy(pathname: string, viewportWidth: number): AdOverlayPolicy {
  const isToolPage = /^\/(?:[a-z]{2}(?:-[A-Za-z]{2})?\/)?tools(?:\/|$)/.test(pathname);

  return {
    anchor: isToolPage,
    video: isToolPage && viewportWidth >= 1024,
    interstitial: isToolPage,
  };
}

/** Compact form of a policy, to compare the one in force with the one a new route asks for. */
export function adOverlayPolicyKey(policy: AdOverlayPolicy): string {
  return [policy.anchor, policy.video, policy.interstitial].join("|");
}

export function parseAdOverlayPolicyKey(key: string | undefined): AdOverlayPolicy | null {
  if (!key) return null;

  const parts = key.split("|");
  if (parts.length !== 3) return null;

  return { anchor: parts[0] === "true", video: parts[1] === "true", interstitial: parts[2] === "true" };
}

/** True when the new policy removes a format the previous one allowed: what is on screen must go. */
export function removesAnOverlay(previous: AdOverlayPolicy | null, next: AdOverlayPolicy): boolean {
  if (!previous) return false;

  return (previous.anchor && !next.anchor) || (previous.video && !next.video) || (previous.interstitial && !next.interstitial);
}
