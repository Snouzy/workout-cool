"use client";

import Script from "next/script";

import { useUserSubscription } from "@/features/ads/hooks/useUserSubscription";

export function AdBlockerForPremium() {
  const { isPremium, isPending } = useUserSubscription();

  if (isPending || !isPremium) {
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
