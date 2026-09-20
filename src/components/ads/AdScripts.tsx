import { env } from "@/env";
import { serverAuth } from "@/entities/user/model/get-server-session-user";

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
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
              ezstandalone.cmd.push(function() {
                ezstandalone.enable();
                ezstandalone.initRewardedAds({
                  anchor: true,
                  interstitial: true,
                  video: true,
                  sideRails: true
                });
              });
              window.ezRewardedAds = window.ezRewardedAds || {};
              window.ezRewardedAds.cmd = window.ezRewardedAds.cmd || [];
            `,
        }}
      />
    </>
  );
}
