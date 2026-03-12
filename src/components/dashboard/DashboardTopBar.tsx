"use client";

// DashboardTopBar — top navigation bar of the dashboard with company selector,
// notification bell, and Post a Job CTA.

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PostJobButton from "@/components/ui/PostJobButton";

export default function DashboardTopBar() {
  const { user, signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 xl:px-10 2xl:px-14 gap-4 sticky top-0 z-30">
      {/* Company selector */}
      <div className="flex items-center gap-2 mr-auto">
        {/* Company logo placeholder */}
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
          <span className="text-brand-indigo text-xs font-bold">
            {user.company?.[0] ?? user.name[0]}
          </span>
        </div>
        <div>
          <p className="text-xs text-subtitle leading-none">Company</p>
          <button className="flex items-center gap-1 text-sm font-semibold text-heading-dark hover:text-brand-indigo transition-colors">
            {user.company ?? user.name}
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Notification bell */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-indigo"
            aria-hidden="true"
          />
        </button>

        {/* Notification panel */}
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50 animate-[fadeSlideUp_0.15s_ease-out]">
            <p className="text-sm font-semibold text-heading-dark mb-3">
              Notifications
            </p>
            <div className="space-y-3">
              {[
                "New applicant for Brand Designer",
                "Interview scheduled for tomorrow",
                "Your job listing expires in 3 days",
              ].map((n, i) => (
                <div key={i} className="flex gap-2.5 text-sm">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-indigo flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-subtitle">{n}</span>
                </div>
              ))}
            </div>
            <button
              className="w-full mt-3 text-xs text-brand-indigo hover:underline text-center"
              onClick={() => setNotifOpen(false)}
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {/* Post a job + View Posted Jobs */}
      <div className="flex items-center gap-2">
        <PostJobButton />
        <Link
          href="/dashboard/job-listing"
          className="flex items-center gap-1.5 px-4 py-2 border border-brand-indigo text-brand-indigo text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
        >
          View Posted Jobs
        </Link>
      </div>
    </header>
  );
}
