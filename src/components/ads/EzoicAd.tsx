"use client";

import { useEffect } from "react";

interface EzoicAdProps {
  placementId: string;
  className?: string;
}

declare global {
  interface Window {
    ezstandalone: {
      cmd: Array<() => void>;
      showAds: (placementId?: string | string[]) => void;
    };
  }
}

export function EzoicAd({ placementId, className = "" }: EzoicAdProps) {
  const divId = `ezoic-pub-ad-placeholder-${placementId}`;

  useEffect(() => {
    const loadEzoicAd = () => {
      if (typeof window !== "undefined" && window.ezstandalone) {
        try {
          window.ezstandalone.cmd = window.ezstandalone.cmd || [];
          window.ezstandalone.cmd.push(function () {
            if (window.ezstandalone && window.ezstandalone.showAds) {
              window.ezstandalone.showAds(placementId);
            }
          });
        } catch (error) {
          console.error("Error loading Ezoic ad:", error);
        }
      }
    };

    // Delay slightly to ensure Ezoic scripts are loaded
    const timeoutId = setTimeout(loadEzoicAd, 100);

    return () => clearTimeout(timeoutId);
  }, [placementId]);

  return <div className={className} id={divId} />;
}
