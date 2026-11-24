import { getAdOverlayPolicy } from "./overlay-policy";

import { env } from "@/env";
import { serverAuth } from "@/entities/user/model/get-server-session-user";

// Runs in the page before hydration. The overlay policy is the app's own function, serialised, so
// the rule for the landing page and the rule for client-side navigation cannot drift apart.
const ezoicBootstrap = `
  window.ezstandalone = window.ezstandalone || {};
  ezstandalone.cmd = ezstandalone.cmd || [];
  window.__wcAdOverlayPolicy = ${getAdOverlayPolicy.toString()};
  ezstandalone.cmd.push(function() {
    var policy = { anchor: false, video: false, interstitial: false };
    try {
      policy = window.__wcAdOverlayPolicy(window.location.pathname, window.innerWidth);
    } catch (error) {
      // The policy must never stop the ads from starting: without it, no overlay at all.
    }
    var call = function(name, value, options) {
      if (typeof ezstandalone[name] === "function") ezstandalone[name](value, options);
    };
    window.__wcAdOverlayKey = [policy.anchor, policy.video, policy.interstitial].join("|");
    call("config", { anchorAdExpansion: false, disableVideo: !policy.video });
    call("setEzoicAnchorAd", policy.anchor);
    call("setOutstreamAllowed", policy.video, { reason: "app-screen" });
    call("setInterstitialAllowed", policy.interstitial, { reason: "app-screen" });
    ezstandalone.enable();
    ezstandalone.initRewardedAds({
      anchor: policy.anchor,
      interstitial: policy.interstitial,
      video: policy.video,
      sideRails: true
    });
  });
  window.ezRewardedAds = window.ezRewardedAds || {};
  window.ezRewardedAds.cmd = window.ezRewardedAds.cmd || [];
`;

export async function AdScripts() {
  if (!env.NEXT_PUBLIC_SHOW_ADS) {
    return null;
  }

  // Ezoic and AdSense inject anchor, side rail and interstitial ads by themselves, outside AdWrapper.
  // A session error must not break the page: on error, the ads stay on.
  const user = await serverAuth().catch(() => null);
  if (user?.isPremium) {
    return null;
  }

  return (
    <>
      <meta content={env.NEXT_PUBLIC_AD_CLIENT} name="google-adsense-account" />

      <script
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_AD_CLIENT}`}
      />

      {/* Ezoic Privacy Scripts */}
      <script data-cfasync="false" src="https://cmp.gatekeeperconsent.com/min.js" />
      <script data-cfasync="false" src="https://the.gatekeeperconsent.com/cmp.min.js" />

      {/* Ezoic Header Script */}
      <script async src="//www.ezojs.com/ezoic/sa.min.js" />
      <script dangerouslySetInnerHTML={{ __html: ezoicBootstrap }} />
    </>
  );
}
