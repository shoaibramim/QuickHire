"use client";

// DashboardSidebar — navigation sidebar for the authenticated dashboard.
// Active link detection via usePathname.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  MdDashboard,
  MdMessage,
  MdBusiness,
  MdPeople,
  MdWork,
  MdCalendarToday,
  MdSettings,
  MdHelp,
  MdLogout,
} from "react-icons/md";
import type { IconType } from "react-icons";

import Logo from "@/components/ui/Logo";
import ProfileUpdateModal from "@/components/ui/ProfileUpdateModal";
import { SIDEBAR_NAV_ITEMS } from "@/constants/dashboardNav";
import { useAuth } from "@/hooks/useAuth";
import { useApiData } from "@/hooks/useApiData";
import type { ConversationSummary } from "@/types/dashboard";
import type { SidebarIconKey } from "@/types/dashboard";

const ICON_MAP: Record<SidebarIconKey, IconType> = {
  dashboard: MdDashboard,
  messages: MdMessage,
  profile: MdBusiness,
  applicants: MdPeople,
  jobs: MdWork,
  schedule: MdCalendarToday,
  settings: MdSettings,
  help: MdHelp,
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: messagesData, refetch: refetchMessages } = useApiData<
    ConversationSummary[]
  >("/dashboard/messages");
  const unreadCount = useMemo(() => {
    if (!messagesData) return 0;
    return messagesData.reduce(
      (total, convo) => total + (convo.unreadCount ?? 0),
      0,
    );
  }, [messagesData]);

  useEffect(() => {
    const handleOpenProfile = () => setProfileOpen(true);
    window.addEventListener("qh-open-profile-modal", handleOpenProfile);
    return () => {
      window.removeEventListener("qh-open-profile-modal", handleOpenProfile);
    };
  }, []);

  useEffect(() => {
    const handleMessagesUpdated = () => {
      refetchMessages();
    };
    window.addEventListener("qh-messages-updated", handleMessagesUpdated);
    return () => {
      window.removeEventListener("qh-messages-updated", handleMessagesUpdated);
    };
  }, [refetchMessages]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      <ProfileUpdateModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <aside
        className="flex flex-col w-[var(--sidebar-width)] bg-footer-bg h-screen sticky top-0 flex-shrink-0"
        aria-label="Dashboard navigation"
      >
        <div className="px-6 py-5 border-b border-gray-700/50">
          <Logo lightText />
        </div>
        <nav
          className="flex-1 px-3 py-4 overflow-y-auto"
          aria-label="Main dashboard links"
        >
          <ul className="space-y-0.5" role="list">
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.iconKey];
              const active = isActive(item.href);
              const badge =
                item.iconKey === "messages" ? unreadCount : item.badge;
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
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.label}</span>
                    {badge !== undefined && badge > 0 && (
                      <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-brand-indigo text-white text-xs font-bold flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-4 pb-5 pt-3 border-t border-gray-700/50 space-y-2">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={signOut}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200/40 px-4 py-2.5 text-sm font-semibold text-red-100 hover:border-red-200 hover:bg-red-500/10 transition-colors"
          >
            <MdLogout className="w-4 h-4" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
