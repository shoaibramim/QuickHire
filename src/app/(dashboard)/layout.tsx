// Dashboard layout wraps all /dashboard/* routes.
// Authentication and role-based shell selection are handled by DashboardGuard.

import type { ReactNode } from "react";

import DashboardGuard from "@/components/dashboard/DashboardGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardGuard>{children}</DashboardGuard>;
}
