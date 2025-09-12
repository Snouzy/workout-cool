import { env } from "@/env";

import { VerticalAdBanner } from "./VerticalAdBanner";

export function VerticalRightBanner() {
  const hasAdSlot = env.NEXT_PUBLIC_VERTICAL_RIGHT_BANNER_AD_SLOT;
  const hasEzoicPlacement = env.NEXT_PUBLIC_EZOIC_VERTICAL_RIGHT_PLACEMENT_ID;
  
  if (!hasAdSlot && !hasEzoicPlacement) {
    return null;
  }

  return (
    <VerticalAdBanner
      adSlot={env.NEXT_PUBLIC_VERTICAL_RIGHT_BANNER_AD_SLOT || ""}
      ezoicPlacementId={env.NEXT_PUBLIC_EZOIC_VERTICAL_RIGHT_PLACEMENT_ID}
      position="right"
    />
  );
}
