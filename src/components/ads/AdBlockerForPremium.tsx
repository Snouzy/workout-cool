"use client";

import Script from "next/script";

import { useBillingConfig } from "@/shared/hooks/use-billing-config";
import { useUserSubscription } from "@/features/ads/hooks/useUserSubscription";

export function AdBlockerForPremium() {
  const { isPremium, isPending } = useUserSubscription();
  const { billingMode } = useBillingConfig();

  // Block ads if user is premium or if billing is disabled (self-hosted)
  const shouldBlockAds = isPremium || billingMode === "DISABLED";

  if (isPending || !shouldBlockAds) {
    return null;
  }

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: `
          // Bloquer les annonces automatiques pour les utilisateurs premium
          (function() {
            // Désactiver les requêtes de publicité
            if (window.adsbygoogle) {
              window.adsbygoogle.pauseAdRequests = 1;
            }

            // CSS pour cacher les pubs auto
            const style = document.createElement('style');
            style.textContent = \`
              .google-auto-placed,
              [data-ad-layout="in-article"],
              [data-auto-format],
              ins.adsbygoogle[data-ad-status="unfilled"],
              .adsbygoogle-noablate {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                width: 0 !important;
                overflow: hidden !important;
              }
            \`;
            document.head.appendChild(style);

            // Empêcher l'injection de nouvelles pubs
            const originalPush = Array.prototype.push;
            if (window.adsbygoogle) {
              window.adsbygoogle.push = function(...args) {
                console.log('Blocking auto ad push for premium user');
                return 0;
              };
            }
          })();
        `,
      }}
      id="block-auto-ads"
      strategy="afterInteractive"
    />
  );
}
