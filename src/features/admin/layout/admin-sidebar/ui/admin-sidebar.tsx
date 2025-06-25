"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, LayoutDashboard, BarChart3, Settings } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import version from "../../../../../../package.json";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview of the statistics.",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage users.",
  },
  {
    name: "Programs",
    href: "/admin/programs",
    icon: BarChart3,
    description: "Manage programs.",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Configuration of the system.",
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-1 flex-col pt-6">
        <nav className="flex-1 space-y-2 px-4">
          <div className="mb-6">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Navigation</h2>
          </div>

          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                className={cn(
                  "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                )}
                href={item.href}
                key={item.name}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300",
                  )}
                />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>WorkoutCool Admin</p>
            <p className="mt-1">Version {version.version}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
