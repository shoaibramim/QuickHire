// Dashboard navigation items — sidebar links used by DashboardSidebar.

import type { SidebarNavItem } from "@/types/dashboard";

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", href: "/dashboard", iconKey: "dashboard" },
  { label: "Messages", href: "/dashboard/messages", iconKey: "messages" },
  {
    label: "All Applicants",
    href: "/dashboard/applicants",
    iconKey: "applicants",
  },
  { label: "Settings", href: "/dashboard/settings", iconKey: "settings" },
  { label: "Help Center", href: "/dashboard/help", iconKey: "help" },
];

export const SIDEBAR_SETTINGS_ITEMS: SidebarNavItem[] = [];
