import { env } from "@/env";

import { VerticalAdBanner } from "./VerticalAdBanner";

export function VerticalRightBanner() {
  if (!env.NEXT_PUBLIC_VERTICAL_RIGHT_BANNER_AD_SLOT) {
    return null;
  }

  return <VerticalAdBanner adSlot={env.NEXT_PUBLIC_VERTICAL_RIGHT_BANNER_AD_SLOT} position="right" />;
}
