"use client";

// DashboardGuard — redirects unauthenticated users to the home page
// and shows a loading skeleton while auth state is being resolved.
// Designed to be replaced with Next.js middleware once backend is live.

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-brand-indigo" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-subtitle">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
