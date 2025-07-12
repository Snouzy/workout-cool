import { env } from "@/env";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

import { GoogleAdSense } from "./GoogleAdSense";
import { AdWrapper } from "./AdWrapper";

export function InArticle({ adSlot }: { adSlot: string }) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!env.NEXT_PUBLIC_AD_CLIENT) {
    return null;
  }

  return (
    <AdWrapper>
      <div className="w-full max-w-full my-4">
        <div className="flex justify-center">
          {isDevelopment ? (
            <AdPlaceholder height="200px" type="In-Article Ad" width="300px" />
          ) : (
            <GoogleAdSense
              adClient={env.NEXT_PUBLIC_AD_CLIENT}
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
          )}
        </div>
      </div>
    </AdWrapper>
  );
}
