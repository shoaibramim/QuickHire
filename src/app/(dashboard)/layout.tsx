// Dashboard layout wraps all /dashboard/* routes.
// Authentication is enforced client-side via DashboardGuard.

import type { ReactNode } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardGuard from "@/components/dashboard/DashboardGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar hidden on mobile, shown from md up */}
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
    </DashboardGuard>
  );
}
