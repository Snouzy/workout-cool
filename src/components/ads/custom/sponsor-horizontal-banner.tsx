"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { getAllSlots } from "./sponsor-config";
import { SponsorCard } from "./sponsor-card";

export function SponsorHorizontalBanner() {
  const allSlots = getAllSlots();

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: false,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  return (
    <div className="w-full py-1">
      {/* Desktop: single banner-style card */}
      <div className="hidden sm:flex justify-center">
        <div className="w-full max-w-md">
          <SponsorCard sponsor={allSlots[0] ?? null} variant="banner" />
        </div>
      </div>

      {/* Mobile: embla carousel */}
      <div className="sm:hidden overflow-hidden mt-2" ref={emblaRef}>
        <div className="flex gap-3">
          {allSlots.map((sponsor, index) => (
            <div className="shrink-0 w-[160px]" key={index}>
              <SponsorCard sponsor={sponsor} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
