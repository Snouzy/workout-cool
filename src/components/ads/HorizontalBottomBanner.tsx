import { env } from "@/env";

import { GoogleAdSense } from "./GoogleAdSense";
import { AdWrapper } from "./AdWrapper";

export function HorizontalBottomBanner({ adSlot }: { adSlot: string }) {
  const _isDevelopment = process.env.NODE_ENV === "development";

  if (!env.NEXT_PUBLIC_AD_CLIENT) {
    return null;
  }

  return (
    <AdWrapper>
      <div className="w-full max-w-full overflow-hidden !max-h-[90px]" style={{ minHeight: "90px", maxHeight: "90px", width: "100%" }}>
        <div className="px-4 py-2">
          <GoogleAdSense
            adClient={env.NEXT_PUBLIC_AD_CLIENT}
            adFormat="horizontal"
            adSlot={adSlot}
            style={{ display: "block", minHeight: "50px", maxHeight: "90px", width: "100%" }}
          />
        </div>
      </div>
    </AdWrapper>
  );
}
