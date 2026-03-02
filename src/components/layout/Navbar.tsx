// Server Component — no direct interactivity needed.
// Auth buttons are handled by <NavAuthButtons> (client component).

import Link from "next/link";

import Logo from "@/components/ui/Logo";
import MobileNav from "@/components/layout/MobileNav";
import NavAuthButtons from "@/components/layout/NavAuthButtons";
import { NAV_LINKS } from "@/constants/siteData";

export default function Navbar() {
  return (
    <header className="w-full bg-transparent">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-4 sm:py-5 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ── Brand + Primary Nav ───────────────────────────── */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Logo />

          <ul
            className="hidden md:flex items-center gap-6 lg:gap-8"
            role="list"
            aria-label="Site navigation links"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-nav-text font-medium text-sm hover:text-brand-indigo transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Auth Actions (desktop) + Mobile Hamburger ────── */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Client component handles auth state & modal trigger */}
          <NavAuthButtons />

          {/* Mobile-only hamburger — client component */}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
