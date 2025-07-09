import { env } from "@/env";

import { VerticalAdBanner } from "./VerticalAdBanner";

export function VerticalLeftBanner() {
  if (!env.NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT) {
    return null;
  }

  return <VerticalAdBanner adSlot={env.NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT} position="left" />;
}
