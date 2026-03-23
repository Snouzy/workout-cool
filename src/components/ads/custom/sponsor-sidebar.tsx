"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getSidebarSlots } from "./sponsor-config";
import { SponsorCard } from "./sponsor-card";

interface SponsorSidebarProps {
  position: "left" | "right";
}

export function SponsorSidebar({ position }: SponsorSidebarProps) {
  const slots = getSidebarSlots(position);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 4);
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  return (
    <div className="hidden lg:flex flex-col w-[240px] sticky top-4 max-h-[calc(100vh-2rem)] relative mx-2">
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-base-200 dark:from-[#18181b] to-transparent z-10 pointer-events-none transition-opacity duration-300"
        style={{ opacity: canScrollUp ? 1 : 0 }}
      />

      {/* Scrollable content */}
      <div className="flex flex-col gap-3 overflow-y-auto" onScroll={checkScroll} ref={scrollRef} style={{ scrollbarWidth: "none" }}>
        {slots.map((sponsor, index) => (
          <SponsorCard key={`${position}-${index}`} sponsor={sponsor} />
        ))}
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-200 dark:from-[#18181b] to-transparent z-10 pointer-events-none transition-opacity duration-300"
        style={{ opacity: canScrollDown ? 1 : 0 }}
      />
    </div>
  );
}
