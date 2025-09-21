"use client";

import { env } from "@/env";

import { GoogleAdSense } from "./GoogleAdSense";
import { EzoicAd } from "./EzoicAd";
import { AdWrapper } from "./AdWrapper";
import { AdPlaceholder } from "./AdPlaceholder";

interface HorizontalAdBannerProps {
  adSlot?: string;
  ezoicPlacementId?: string;
}

export function HorizontalAdBanner({ adSlot, ezoicPlacementId }: HorizontalAdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const useEzoic = env.NEXT_PUBLIC_AD_PROVIDER === "ezoic" && ezoicPlacementId;

  if (!env.NEXT_PUBLIC_AD_CLIENT && !useEzoic) {
    return null;
  }

  return (
    <AdWrapper>
      <div
        className="w-full max-w-full"
        style={{
          minHeight: "auto",
          width: "100%",
          maxHeight: "90px",
          height: "90px",
        }}
      >
        <div className="py-1 flex justify-center w-full">
          {isDevelopment ? (
            <AdPlaceholder height="90px" type="Horizontal Ad Banner" width="100%" />
          ) : useEzoic ? (
            <div className="responsive-ad-container">
              <EzoicAd className="w-full h-full" placementId={ezoicPlacementId} />
            </div>
          ) : adSlot ? (
            <div className="responsive-ad-container">
              <GoogleAdSense
                adClient={env.NEXT_PUBLIC_AD_CLIENT as string}
                adFormat="fluid"
                adSlot={adSlot}
                fullWidthResponsive={true}
                style={{
                  display: "block",
                  width: "100%",
                  height: "90px",
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .responsive-ad-container {
          width: 100%;
          max-width: 320px;
          height: 50px;
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .responsive-ad-container {
            max-width: 468px;
            height: 60px;
          }
        }

        @media (min-width: 769px) {
          .responsive-ad-container {
            max-width: 728px;
            height: 90px;
          }
        }
      `}</style>
    </AdWrapper>
  );
}
