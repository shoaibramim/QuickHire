// Public route group layout — wraps all (public) pages with Navbar + Footer.
// The landing page's bg is set per-page; this layout stays transparent.

import type { ReactNode } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PublicLayoutClient from "@/components/layout/PublicLayoutClient";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-hero-bg flex flex-col">
      <Navbar />
      <PublicLayoutClient>{children}</PublicLayoutClient>
      <Footer />
    </div>
  );
}
