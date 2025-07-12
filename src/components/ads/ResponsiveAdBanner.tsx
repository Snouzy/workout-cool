"use client";

import { env } from "@/env";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

import { GoogleAdSense } from "./GoogleAdSense";
import { AdWrapper } from "./AdWrapper";

interface ResponsiveAdBannerProps {
  adSlot: string;
}

export function ResponsiveAdBanner({ adSlot }: ResponsiveAdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!env.NEXT_PUBLIC_AD_CLIENT) {
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
            <AdPlaceholder height="90px" type="Ad Banner" width="100%" />
          ) : (
            <div className="responsive-ad-container">
              <GoogleAdSense
                adClient={env.NEXT_PUBLIC_AD_CLIENT}
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
          )}
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
