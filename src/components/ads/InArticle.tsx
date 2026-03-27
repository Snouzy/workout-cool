import { GoogleAdSense } from "./GoogleAdSense";
import { EzoicAd } from "./EzoicAd";
import { SponsorHorizontalBanner } from "./custom";
import { AdWrapper } from "./AdWrapper";

import { env } from "@/env";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface InArticleProps {
  adSlot?: string;
  ezoicPlacementId?: string;
}

export function InArticle({ adSlot, ezoicPlacementId }: InArticleProps) {
  if (env.NEXT_PUBLIC_AD_PROVIDER === "custom") {
    return (
      <AdWrapper>
        <div className="w-full max-w-full my-4">
          <SponsorHorizontalBanner />
        </div>
      </AdWrapper>
    );
  }

  const isDevelopment = process.env.NODE_ENV === "development";
  const useEzoic = env.NEXT_PUBLIC_AD_PROVIDER === "ezoic" && ezoicPlacementId;

  if (!env.NEXT_PUBLIC_AD_CLIENT && !useEzoic) {
    return null;
  }

  return (
    <AdWrapper>
      <div className="w-full max-w-full my-4">
        <div className="flex justify-center">
          {isDevelopment ? (
            <AdPlaceholder height="200px" type="In-Article Ad" width="300px" />
          ) : useEzoic ? (
            <EzoicAd className="w-full" placementId={ezoicPlacementId} />
          ) : adSlot ? (
            <GoogleAdSense
              adClient={env.NEXT_PUBLIC_AD_CLIENT as string}
              adFormat="fluid"
              adSlot={adSlot}
              className="adsbygoogle"
              style={{
                display: "block",
                textAlign: "center",
                width: "300px",
                height: "200px",
              }}
            />
          ) : null}
        </div>
      </div>
    </AdWrapper>
  );
}
