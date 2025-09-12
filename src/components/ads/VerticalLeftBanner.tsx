import { env } from "@/env";

import { VerticalAdBanner } from "./VerticalAdBanner";

export function VerticalLeftBanner() {
  const hasAdSlot = env.NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT;
  const hasEzoicPlacement = env.NEXT_PUBLIC_EZOIC_VERTICAL_LEFT_PLACEMENT_ID;

  if (!hasAdSlot && !hasEzoicPlacement) {
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
