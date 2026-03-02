// Dashboard navigation items — sidebar links used by DashboardSidebar.

import type { SidebarNavItem } from "@/types/dashboard";

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard",      href: "/dashboard",              iconKey: "dashboard" },
  { label: "Messages",       href: "/dashboard/messages",     iconKey: "messages",  badge: 1 },
  { label: "Company Profile",href: "/dashboard/profile",      iconKey: "profile" },
  { label: "All Applicants", href: "/dashboard/applicants",   iconKey: "applicants" },
  { label: "Job Listing",    href: "/dashboard/job-listing",  iconKey: "jobs" },
  { label: "My Schedule",    href: "/dashboard/schedule",     iconKey: "schedule" },
];

export const SIDEBAR_SETTINGS_ITEMS: SidebarNavItem[] = [
  { label: "Settings",    href: "/dashboard/settings", iconKey: "settings" },
  { label: "Help Center", href: "/dashboard/help",     iconKey: "help" },
];
