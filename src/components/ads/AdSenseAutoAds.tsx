"use client";

import { useEffect } from "react";

import { useUserSubscription } from "@/features/ads/hooks/useUserSubscription";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSenseAutoAds() {
  const { isPremium, isPending } = useUserSubscription();

  useEffect(() => {
    // Si l'utilisateur est premium, on désactive les pubs automatiques
    if (isPremium && !isPending) {
      // Méthode 1: Désactiver via l'API AdSense
      if (window.adsbygoogle) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.adsbygoogle.pauseAdRequests = 1;
      }

      // Méthode 3: Bloquer l'injection de nouvelles pubs via MutationObserver
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.classList.contains("adsbygoogle")) {
                node.remove();
              }
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Nettoyer l'observer quand le composant est démonté
      return () => observer.disconnect();
    } else if (!isPremium && !isPending) {
      // Réactiver les pubs pour les utilisateurs non-premium
      if (window.adsbygoogle) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.adsbygoogle.pauseAdRequests = 0;
      }
    }
  }, [isPremium, isPending]);

  // Ne rendre rien - ce composant gère seulement la logique
  return null;
}
