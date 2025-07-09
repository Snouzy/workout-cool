import { env } from "@/env";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

import { GoogleAdSense } from "./GoogleAdSense";
import { AdWrapper } from "./AdWrapper";

export function HorizontalTopBanner({ adSlot }: { adSlot: string }) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!env.NEXT_PUBLIC_AD_CLIENT) {
    return null;
  }

  return (
    <AdWrapper>
      <div className="w-full max-w-full" style={{ minHeight: "auto !important", maxHeight: "100px", width: "100%" }}>
        <div className="px-4 py-2">
          {isDevelopment ? (
            <AdPlaceholder height="90px" type="Ad Banner (Top)" width="100%" />
          ) : (
            <GoogleAdSense
              adClient={env.NEXT_PUBLIC_AD_CLIENT}
              adFormat="horizontal"
              adSlot={adSlot}
              style={{ display: "block", minHeight: "50px", maxHeight: "90px", width: "100%" }}
            />
          )}
        </div>
      </div>
    </AdWrapper>
  );
}
