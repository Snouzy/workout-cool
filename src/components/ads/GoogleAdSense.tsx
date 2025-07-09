"use client";

import { useEffect } from "react";

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
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "",
}: GoogleAdSenseProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("Error loading Google AdSense:", error);
    }
  }, []);

  return (
    <div className="overflow-hidden" style={{ maxWidth: "100%" }}>
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
