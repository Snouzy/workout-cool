import { HorizontalAdBanner } from "./HorizontalAdBanner";

interface HorizontalTopBannerProps {
  adSlot?: string;
  ezoicPlacementId?: string;
}

export function HorizontalTopBanner({ adSlot, ezoicPlacementId }: HorizontalTopBannerProps) {
  return <HorizontalAdBanner adSlot={adSlot} ezoicPlacementId={ezoicPlacementId} />;
}
