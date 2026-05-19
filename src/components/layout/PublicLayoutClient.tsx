"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  MdDashboard,
  MdHome,
  MdMessage,
  MdMoreHoriz,
  MdPeople,
  MdWork,
} from "react-icons/md";

import DashboardMobileNav, {
  type MoreAction,
} from "@/components/dashboard/DashboardMobileNav";
import ProfileUpdateModal from "@/components/ui/ProfileUpdateModal";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPathForRole } from "@/services/authService";

export default function PublicLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [hideTabs, setHideTabs] = useState(false);

  useEffect(() => {
    if (!user) return;
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideTabs(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [user]);

  if (!user) {
    return <main className="flex-1">{children}</main>;
  }

  const dashboardHref = getDashboardPathForRole(user.role);
  const isSeeker = user.role === "jobseeker";
  const items = isSeeker
    ? [
        { label: "Home", href: "/", icon: MdHome },
        { label: "Dashboard", href: dashboardHref, icon: MdDashboard },
        {
          label: "Messages",
          href: "/dashboard/seeker/messages",
          icon: MdMessage,
        },
        { label: "Browse Jobs", href: "/jobs", icon: MdWork },
      ]
    : [
        { label: "Home", href: "/", icon: MdHome },
        { label: "Dashboard", href: dashboardHref, icon: MdDashboard },
        { label: "Messages", href: "/dashboard/messages", icon: MdMessage },
        { label: "Applicants", href: "/dashboard/applicants", icon: MdPeople },
      ];
  const moreActions: MoreAction[] = isSeeker
    ? [
        { label: "Update Profile", onClick: () => setProfileOpen(true) },
        { label: "Settings", href: "/dashboard/seeker/settings" },
        { label: "Help", href: "/help" },
        { label: "Logout", onClick: signOut, tone: "danger" },
      ]
    : [
        { label: "Settings", href: "/dashboard/settings" },
        { label: "Update Profile", onClick: () => setProfileOpen(true) },
        { label: "Help Center", href: "/dashboard/help" },
        { label: "Logout", onClick: signOut, tone: "danger" },
      ];

  return (
    <>
      <ProfileUpdateModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <DashboardMobileNav
        items={items}
        moreActions={moreActions}
        moreIcon={MdMoreHoriz}
        moreLabel="More"
        hidden={hideTabs}
      />
    </>
  );
}
