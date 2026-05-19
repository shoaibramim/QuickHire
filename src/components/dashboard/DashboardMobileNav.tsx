"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdMoreHoriz } from "react-icons/md";
import type { IconType } from "react-icons";

import { useApiData } from "@/hooks/useApiData";
import type { ConversationSummary } from "@/types/dashboard";

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  badge?: number;
};

export type MoreAction = {
  label: string;
  href?: string;
  onClick?: () => void | Promise<void>;
  tone?: "default" | "danger";
};

interface Props {
  items: NavItem[];
  moreActions?: MoreAction[];
  moreLabel?: string;
  moreIcon?: IconType;
  hidden?: boolean;
}

export default function DashboardMobileNav({
  items,
  moreActions,
  moreLabel = "More",
  moreIcon: MoreIcon = MdMoreHoriz,
  hidden = false,
}: Props) {
  const pathname = usePathname();
  const { data: messagesData, refetch } = useApiData<ConversationSummary[]>(
    "/dashboard/messages",
  );
  const [moreOpen, setMoreOpen] = useState(false);

  const unreadCount = useMemo(() => {
    if (!messagesData) return 0;
    return messagesData.reduce(
      (total, convo) => total + (convo.unreadCount ?? 0),
      0,
    );
  }, [messagesData]);

  useEffect(() => {
    const handleMessagesUpdated = () => refetch();
    window.addEventListener("qh-messages-updated", handleMessagesUpdated);
    return () => {
      window.removeEventListener("qh-messages-updated", handleMessagesUpdated);
    };
  }, [refetch]);

  useEffect(() => {
    if (hidden) setMoreOpen(false);
  }, [hidden]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/dashboard/seeker") return pathname === "/dashboard/seeker";
    return pathname.startsWith(href);
  }

  const resolvedItems = items.map((item) => {
    if (item.href.includes("/messages")) {
      return { ...item, badge: unreadCount };
    }
    return item;
  });

  const tabs = moreActions?.length
    ? [...resolvedItems, { label: moreLabel, href: "__more__", icon: MoreIcon }]
    : resolvedItems;

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 transition-transform duration-300 ease-out transition-opacity ${
        hidden
          ? "translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
      aria-label="Dashboard navigation"
    >
      <ul
        className="grid px-2 py-2"
        style={{
          gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        }}
        role="list"
      >
        {tabs.map((item) => {
          const Icon = item.icon;
          const isMore = item.href === "__more__";
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              {isMore ? (
                <button
                  type="button"
                  onClick={() => setMoreOpen(true)}
                  className={[
                    "w-full flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium",
                    moreOpen
                      ? "text-brand-indigo"
                      : "text-subtitle hover:text-heading-dark",
                  ].join(" ")}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span className="truncate max-w-[64px]">{item.label}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={[
                    "flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium",
                    active
                      ? "text-brand-indigo"
                      : "text-subtitle hover:text-heading-dark",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-brand-indigo text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <span className="truncate max-w-[64px]">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {moreOpen && moreActions?.length && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-heading-dark">
                {moreLabel}
              </h2>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="text-xs font-semibold text-subtitle hover:text-heading-dark"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              {moreActions.map((action) => {
                const classes =
                  action.tone === "danger"
                    ? "border border-red-200 text-red-600 hover:bg-red-50"
                    : "border border-gray-200 text-heading-dark hover:bg-gray-50";
                if (action.href) {
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      onClick={() => setMoreOpen(false)}
                      className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center justify-center text-center ${classes}`}
                    >
                      {action.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={async () => {
                      await action.onClick?.();
                      setMoreOpen(false);
                    }}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center justify-center text-center ${classes}`}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
