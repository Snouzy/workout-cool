"use client";

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
      icon: <Dumbbell size={24} />,
    },
    {
      id: "programs",
      label: "Programs",
      href: `${paths.programs}`,
      icon: <Calendar size={24} />,
    },
  ];

  return (
    <nav className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#232324] px-4 py-1">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out",
                "hover:bg-base-100 dark:hover:bg-slate-800",
                isActive ? "text-primary dark:text-primary" : "text-base-content/60 dark:text-gray-400",
              )}
              href={tab.href}
              key={tab.id}
            >
              <div className={cn("transition-all duration-200 ease-in-out", isActive ? "scale-110" : "scale-100")}>{tab.icon}</div>
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200 ease-in-out",
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
