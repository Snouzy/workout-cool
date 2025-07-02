import { env } from "@/env";

import { GoogleAdSense } from "./GoogleAdSense";
import { AdWrapper } from "./AdWrapper";
import { AdPlaceholder } from "./AdPlaceholder";

interface VerticalAdBannerProps {
  adSlot: string;
  position?: "left" | "right";
}

export function VerticalAdBanner({ adSlot, position = "left" }: VerticalAdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!env.NEXT_PUBLIC_AD_CLIENT) {
    return null;
  }

  return (
    <AdWrapper>
      <div className="hidden lg:block w-[160px] h-[600px] sticky top-4">
        {isDevelopment ? (
          <AdPlaceholder height="600px" type={`Vertical Ad (${position})`} width="160px" />
        ) : (
          <GoogleAdSense
            adClient={env.NEXT_PUBLIC_AD_CLIENT}
            adSlot={adSlot}
            style={{ display: "block", width: "160px", height: "600px" }}
          />
        )}
      </div>
    </AdWrapper>
  );
}
