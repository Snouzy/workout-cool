"use client";

import { useCallback, useEffect, useRef } from "react";

import { getAllSlots } from "./sponsor-config";
import { SponsorCard } from "./sponsor-card";

const AUTO_SCROLL_INTERVAL = 3000;

export function SponsorHorizontalBanner() {
  const allSlots = getAllSlots();
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollNext = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) return;

    // If at the end, loop back to start
    if (scrollLeft >= maxScroll - 2) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: 148, behavior: "smooth" }); // card width (140) + gap (8)
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(scrollNext, AUTO_SCROLL_INTERVAL);
  }, [scrollNext]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [startAutoScroll, stopAutoScroll]);

  return (
    <div className="w-full py-1">
      {/* Desktop: single banner-style card */}
      <div className="hidden sm:flex justify-center">
        <div className="w-full max-w-md">
          <SponsorCard sponsor={allSlots[0] ?? null} variant="banner" />
        </div>
      </div>

      {/* Mobile: auto-scrolling carousel */}
      <div
        className="sm:hidden overflow-x-auto snap-x snap-mandatory"
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
        onTouchEnd={startAutoScroll}
        onTouchStart={stopAutoScroll}
        ref={scrollRef}
        style={{ scrollbarWidth: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex gap-2 w-max px-1">
          {allSlots.map((sponsor, index) => (
            <div className="snap-start shrink-0 w-[140px]" key={index}>
              <SponsorCard sponsor={sponsor} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
