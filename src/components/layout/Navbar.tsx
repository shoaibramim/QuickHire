// Server Component — no interactivity required
// TODO: Add mobile hamburger menu (MobileNav) with "use client" when needed
// TODO: Wrap auth actions with session check (e.g. next-auth) for conditional rendering

import Link from "next/link";

import Logo from "@/components/ui/Logo";
import LinkButton from "@/components/ui/LinkButton";
import { NAV_LINKS } from "@/constants/mockData";

export default function Navbar() {
  return (
    <header className="w-full bg-transparent">
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-16 py-5 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ── Brand ─────────────────────────────────────────── */}
        <Logo />

        {/* ── Primary Nav Links ─────────────────────────────── */}
        <ul
          className="hidden md:flex items-center gap-8"
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

        {/* ── Auth Actions ──────────────────────────────────── */}
        <div className="flex items-center gap-4">
          {/* TODO: Hide Login & show user avatar/menu when authenticated */}
          <Link
            href="/login"
            className="hidden sm:block text-brand-indigo font-semibold text-sm hover:text-indigo-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo rounded"
            aria-label="Log in to your QuickHire account"
          >
            Login
          </Link>

          <LinkButton
            href="/signup"
            variant="primary"
            size="sm"
            aria-label="Create a free QuickHire account"
          >
            Sign Up
          </LinkButton>
        </div>
      </nav>
    </header>
  );
}
