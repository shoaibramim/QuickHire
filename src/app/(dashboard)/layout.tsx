// Dashboard layout — wraps all /dashboard/* routes.
// Authentication is enforced client-side via DashboardGuard.
// TODO: Add Next.js middleware for server-side JWT validation when backend is live.

import type { ReactNode } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardGuard from "@/components/dashboard/DashboardGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar — hidden on mobile, shown from md up */}
        <div className="hidden md:flex">
          <DashboardSidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <DashboardTopBar />

          <main
            className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6"
            id="dashboard-main"
          >
            {children}
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
