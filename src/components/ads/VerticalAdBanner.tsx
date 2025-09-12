import { env } from "@/env";

import { GoogleAdSense } from "./GoogleAdSense";
import { EzoicAd } from "./EzoicAd";
import { AdWrapper } from "./AdWrapper";
import { AdPlaceholder } from "./AdPlaceholder";

interface VerticalAdBannerProps {
  adSlot: string;
  ezoicPlacementId?: string;
  position?: "left" | "right";
}

export function VerticalAdBanner({ adSlot, ezoicPlacementId, position = "left" }: VerticalAdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const useEzoic = env.NEXT_PUBLIC_AD_PROVIDER === "ezoic" && ezoicPlacementId;

  if (!env.NEXT_PUBLIC_AD_CLIENT && !useEzoic) {
    return null;
  }

  return (
    <AdWrapper>
      <div className="hidden lg:block w-[160px] h-[600px] sticky top-4">
        {isDevelopment ? (
          <AdPlaceholder height="600px" type={`Vertical Ad (${position})`} width="160px" />
        ) : useEzoic ? (
          <EzoicAd className="w-[160px] h-[600px]" placementId={ezoicPlacementId} />
        ) : (
          <GoogleAdSense
            adClient={env.NEXT_PUBLIC_AD_CLIENT as string}
            adSlot={adSlot}
            style={{ display: "block", width: "160px", height: "600px" }}
          />
        )}
      </div>
    </AdWrapper>
  );
}
