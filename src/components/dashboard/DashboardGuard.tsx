"use client";

// DashboardGuard — resolves auth, enforces role-specific dashboard routing,
// and renders the matching dashboard shell.

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getDashboardPathForRole } from "@/services/authService";

export default function DashboardGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (isLoading || !user) return;
    const preferredPath = getDashboardPathForRole(user.role);
    const isSeekerPath = pathname.startsWith("/dashboard/seeker");
    if (user.role === "jobseeker" && !isSeekerPath) {
      router.replace(preferredPath);
      return;
    }
    if (user.role !== "jobseeker" && isSeekerPath) {
      router.replace(preferredPath);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-brand-indigo"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-subtitle">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <DashboardShell role={user.role}>{children}</DashboardShell>;
}
