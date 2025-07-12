"use client";

import { useEffect, useRef } from "react";

interface GoogleAdSenseProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function GoogleAdSense({
  adClient,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = false,
  style = { display: "block" },
  className = "",
}: GoogleAdSenseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isAdLoaded = false;
    let resizeObserver: ResizeObserver | null = null;
    let checkInterval: NodeJS.Timeout | null = null;
    let safetyTimeout: NodeJS.Timeout | null = null;

    const loadAdSense = () => {
      if (!containerRef.current || isAdLoaded) return false;

      const width = containerRef.current.offsetWidth;
      const computedStyle = window.getComputedStyle(containerRef.current);
      const isVisible = computedStyle.display !== "none" && computedStyle.visibility !== "hidden";
      
      if (width > 0 && isVisible) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isAdLoaded = true;
        } catch (error) {
          console.error("Error loading Google AdSense:", error);
        }
        return true; // Chargement réussi
      }
      return false; // Pas encore prêt
    };

    // Attendre un court délai pour s'assurer que le DOM est prêt
    const timeoutId = setTimeout(() => {
      // Méthode avec ResizeObserver (plus élégante)
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 0 && !isAdLoaded) {
              loadAdSense();
              if (isAdLoaded && resizeObserver) {
                resizeObserver.disconnect();
                break;
              }
            }
          }
        });

        if (containerRef.current) {
          // Essayer de charger immédiatement si possible
          loadAdSense();
          
          // Si pas encore chargé, observer les changements
          if (!isAdLoaded && resizeObserver) {
            resizeObserver.observe(containerRef.current);
          }
        }
      } else {
        // Fallback avec setInterval pour les navigateurs anciens
        checkInterval = setInterval(() => {
          if (loadAdSense() && checkInterval) {
            clearInterval(checkInterval);
          }
        }, 100);

        // Timeout de sécurité pour éviter les boucles infinies
        safetyTimeout = setTimeout(() => {
          if (checkInterval) clearInterval(checkInterval);
        }, 5000);
      }
    }, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (resizeObserver) resizeObserver.disconnect();
      if (checkInterval) clearInterval(checkInterval);
      if (safetyTimeout) clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <div className="overflow-hidden" ref={containerRef} style={{ maxWidth: "100%", maxHeight: style?.maxHeight || "auto" }}>
      <ins
        className={`adsbygoogle ${className}`}
        data-ad-client={adClient}
        data-ad-format={adFormat}
        data-ad-slot={adSlot}
        data-full-width-responsive={fullWidthResponsive}
        style={style}
      />
    </div>
  );
}
