"use client";

import { useState, useEffect } from "react";

import { VerticalAdBanner } from "./VerticalAdBanner";

import { env } from "@/env";

export function VerticalLeftBanner() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isCustom = env.NEXT_PUBLIC_AD_PROVIDER === "custom";
  const hasAdSlot = env.NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT;
  const hasEzoicPlacement = env.NEXT_PUBLIC_EZOIC_VERTICAL_LEFT_PLACEMENT_ID;

  if (!isCustom && !hasAdSlot && !hasEzoicPlacement) {
    return null;
  }

  if (!isDesktop) {
    return null;
  }

  return (
    <VerticalAdBanner
      adSlot={env.NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT || ""}
      ezoicPlacementId={env.NEXT_PUBLIC_EZOIC_VERTICAL_LEFT_PLACEMENT_ID}
      position="left"
    />
  );
}
