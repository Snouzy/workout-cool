import { VerticalAdBanner } from "./VerticalAdBanner";

import { env } from "@/env";

export function VerticalLeftBanner() {
  const isCustom = env.NEXT_PUBLIC_AD_PROVIDER === "custom";
  const hasAdSlot = env.NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT;
  const hasEzoicPlacement = env.NEXT_PUBLIC_EZOIC_VERTICAL_LEFT_PLACEMENT_ID;

  if (!isCustom && !hasAdSlot && !hasEzoicPlacement) {
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
