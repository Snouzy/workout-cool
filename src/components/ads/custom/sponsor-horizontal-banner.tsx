"use client";

import { getAllSlots } from "./sponsor-config";
import { SponsorCard } from "./sponsor-card";

export function SponsorHorizontalBanner() {
  const allSlots = getAllSlots();

  // Duplicate slots for seamless infinite scroll
  const duplicatedSlots = [...allSlots, ...allSlots];

  return (
    <div className="w-full py-1">
      {/* Desktop: single banner-style card */}
      <div className="hidden sm:flex justify-center">
        <div className="w-full max-w-md">
          <SponsorCard sponsor={allSlots[0] ?? null} variant="banner" />
        </div>
      </div>

      {/* Mobile: continuous marquee scroll */}
      <div className="sm:hidden overflow-hidden">
        <div className="mt-2 flex gap-3 animate-marquee w-max">
          {duplicatedSlots.map((sponsor, index) => (
            <div className="shrink-0 w-[160px]" key={index}>
              <SponsorCard sponsor={sponsor} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
