"use client";

import { HorizontalAdBanner } from "@/components/ads/HorizontalAdBanner";

interface HorizontalBottomBannerProps {
  adSlot?: string;
  ezoicPlacementId?: string;
}

export function HorizontalBottomBanner({ adSlot, ezoicPlacementId }: HorizontalBottomBannerProps) {
  return <HorizontalAdBanner adSlot={adSlot} ezoicPlacementId={ezoicPlacementId} />;
}
