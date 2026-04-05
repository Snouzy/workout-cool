"use client";

import { GoogleAdSense } from "./GoogleAdSense";
import { EzoicAd } from "./EzoicAd";
import { SponsorHorizontalBanner } from "./custom";
import { AdWrapper } from "./AdWrapper";
import { AdPlaceholder } from "./AdPlaceholder";

import { env } from "@/env";

interface HorizontalAdBannerProps {
  adSlot?: string;
  ezoicPlacementId?: string;
}

export function HorizontalAdBanner({ adSlot, ezoicPlacementId }: HorizontalAdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    return (
      <>
        <div className="">
          <AdWrapper>
            <AdPlaceholder height="90px" type="Horizontal Ad Banner" width="100%" />
          </AdWrapper>
        </div>
      </>
    );
  }

  if (env.NEXT_PUBLIC_AD_PROVIDER === "custom") {
    return (
      <div className="lg:hidden min-h-[90px]">
        <AdWrapper>
          <SponsorHorizontalBanner />
        </AdWrapper>
      </div>
    );
  }

  const useEzoic = env.NEXT_PUBLIC_AD_PROVIDER === "ezoic" && ezoicPlacementId;

  // Ezoic: render a single placement — never two with the same ID (duplicate IDs → 400 bad response)
  if (useEzoic) {
    return (
      <AdWrapper>
        <div className="w-full min-h-[90px]">
          <EzoicAd className="w-full" placementId={ezoicPlacementId} />
        </div>
      </AdWrapper>
    );
  }

  return (
    <>
      {/* Below lg: sponsor carousel */}
      <div className="lg:hidden min-h-[90px]">
        <AdWrapper>
          <SponsorHorizontalBanner />
        </AdWrapper>
      </div>

      {/* lg+: show adsense */}
      {env.NEXT_PUBLIC_AD_CLIENT && adSlot && (
        <div className="hidden lg:block">
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
              </div>
            </div>

            <style>{`
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
        </div>
      )}
    </>
  );
}
