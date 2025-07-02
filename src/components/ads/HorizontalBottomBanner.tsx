import { GoogleAdSense } from "./GoogleAdSense";
import { AdWrapper } from "./AdWrapper";

export function HorizontalBottomBanner({ adSlot }: { adSlot: string }) {
  const _isDevelopment = process.env.NODE_ENV === "development";

  return (
    <AdWrapper>
      <div className="w-full max-w-full overflow-hidden !max-h-[90px]" style={{ minHeight: "90px", maxHeight: "90px", width: "100%" }}>
        <div className="px-4 py-2">
          <GoogleAdSense
            adClient="ca-pub-3437447245301146"
            adFormat="horizontal"
            adSlot={adSlot}
            style={{ display: "block", minHeight: "50px", maxHeight: "90px", width: "100%" }}
          />
        </div>
      </div>
    </AdWrapper>
  );
}
