"use client";

// DashboardSidebar — navigation sidebar for the authenticated dashboard.
// Active link detection via usePathname.

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdMessage,
  MdBusiness,
  MdPeople,
  MdWork,
  MdCalendarToday,
  MdSettings,
  MdHelp,
} from "react-icons/md";
import type { IconType } from "react-icons";

import Logo from "@/components/ui/Logo";
import { SIDEBAR_NAV_ITEMS, SIDEBAR_SETTINGS_ITEMS } from "@/constants/dashboardMockData";
import type { SidebarIconKey } from "@/types/dashboard";

const ICON_MAP: Record<SidebarIconKey, IconType> = {
  dashboard: MdDashboard,
  messages:  MdMessage,
  profile:   MdBusiness,
  applicants:MdPeople,
  jobs:      MdWork,
  schedule:  MdCalendarToday,
  settings:  MdSettings,
  help:      MdHelp,
};

export default function DashboardSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="flex flex-col w-[var(--sidebar-width)] bg-footer-bg h-screen sticky top-0 flex-shrink-0"
      aria-label="Dashboard navigation"
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700/50">
        <Logo lightText />
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Main dashboard links">
        <ul className="space-y-0.5" role="list">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconKey];
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-brand-indigo text-white"
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-white",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-brand-indigo text-white text-xs font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings section */}
      <div className="px-3 py-4 border-t border-gray-700/50">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Settings
        </p>
        <ul className="space-y-0.5" role="list">
          {SIDEBAR_SETTINGS_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconKey];
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-brand-indigo text-white"
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-white",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
