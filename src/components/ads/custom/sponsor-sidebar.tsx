"use client";

import { getSidebarSlots } from "./sponsor-config";
import { SponsorCard } from "./sponsor-card";

interface SponsorSidebarProps {
  position: "left" | "right";
}

export function SponsorSidebar({ position }: SponsorSidebarProps) {
  const slots = getSidebarSlots(position);

  return (
    <div className="hidden lg:flex flex-col gap-3 w-[240px] sticky top-4">
      {slots.map((sponsor, index) => (
        <SponsorCard key={`${position}-${index}`} sponsor={sponsor} />
      ))}
    </div>
  );
}
