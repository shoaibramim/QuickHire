"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdWork,
  MdHelp,
  MdLogout,
  MdMessage,
} from "react-icons/md";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import ProfileUpdateModal from "@/components/ui/ProfileUpdateModal";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useApiData } from "@/hooks/useApiData";
import type { ConversationSummary } from "@/types/dashboard";
import type { User } from "@/types/auth";

type Props = {
  role: User["role"];
  children: ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: typeof MdDashboard;
};

function SeekerShell({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const pathname = usePathname();
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
  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard/seeker", icon: MdDashboard },
    { label: "Messages", href: "/dashboard/seeker/messages", icon: MdMessage },
    { label: "Browse Jobs", href: "/jobs", icon: MdWork },
    { label: "Help", href: "/help", icon: MdHelp },
  ];

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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <ProfileUpdateModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <aside className="hidden md:flex flex-col w-[var(--sidebar-width)] bg-white border-r border-gray-100 h-screen sticky top-0 flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-100">
          <Logo />
        </div>
        <div className="px-6 pt-5 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtitle">
            Job Seeker Workspace
          </p>
          <p className="mt-2 text-sm text-subtitle leading-relaxed">
            Track applications, discover relevant roles, and keep your profile
            ready.
          </p>
        </div>
        <nav
          className="flex-1 px-3 py-4 overflow-y-auto"
          aria-label="Job seeker dashboard links"
        >
          <ul className="space-y-0.5" role="list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              const badge =
                item.href === "/dashboard/seeker/messages" ? unreadCount : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                      active
                        ? "bg-indigo-50 text-brand-indigo"
                        : "text-subtitle hover:bg-gray-50 hover:text-heading-dark",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                    {badge > 0 && (
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

        <div className="px-4 pb-5 pt-3 border-t border-gray-100 space-y-2">
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
          >
            <MdLogout className="w-4 h-4" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto py-6" id="dashboard-main">
          <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardShell({ role, children }: Props) {
  if (role === "jobseeker") {
    return <SeekerShell>{children}</SeekerShell>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden md:flex">
        <DashboardSidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <DashboardTopBar />
        <main className="flex-1 overflow-y-auto py-6" id="dashboard-main">
          <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
