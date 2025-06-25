"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Calendar } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { paths } from "@/shared/constants/paths";

export function BottomNavigation() {
  const pathname = usePathname();

  const tabs = [
    {
      id: "workout-builder",
      label: "Workout Builder",
      href: paths.root,
      icon: Dumbbell,
    },
    {
      id: "programs",
      label: "Programs",
      href: `${paths.programs}`,
      icon: Calendar,
    },
  ];

  return (
    <nav className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#232324] px-2 py-0.5">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const IconComponent = tab.icon;

          return (
            <Link
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ease-in-out",
                "hover:bg-base-100 dark:hover:bg-slate-800",
                isActive ? "text-primary dark:text-primary" : "text-base-content/60 dark:text-gray-400",
              )}
              href={tab.href}
              key={tab.id}
            >
              <div className={cn("ease-in-out", isActive ? "scale-110" : "scale-100")}>
                <IconComponent size={isActive ? 22 : 18} />
              </div>
              <span
                className={cn(
                  "text-xs font-medium ease-in-out leading-tight",
                  isActive ? "text-primary dark:text-primary" : "text-base-content/60 dark:text-gray-400",
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
