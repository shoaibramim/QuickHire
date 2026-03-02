"use client";

/**
 * NavAuthButtons — client component rendering auth CTAs in the Navbar.
 *
 * When unauthenticated: Login + Sign Up buttons that open the AuthModal.
 * When authenticated: User avatar/name dropdown with sign-out option.
 *
 * Kept as a separate client component so the Navbar server component
 * doesn't need to become a client component itself.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";
import PostJobButton from "@/components/ui/PostJobButton";
import { useAuth } from "@/hooks/useAuth";

export default function NavAuthButtons() {
  const { user, isLoading, openAuthModal, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (isLoading) {
    // Skeleton placeholder to avoid layout shift
    return (
      <div className="hidden md:flex items-center gap-3">
        <div className="w-16 h-8 rounded-lg bg-gray-200 animate-pulse" />
        <div className="w-20 h-8 rounded-lg bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => openAuthModal("signin")}
          className="text-brand-indigo font-semibold text-sm hover:text-indigo-700 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo rounded px-1"
          aria-label="Log in to your QuickHire account"
        >
          Login
        </button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => openAuthModal("signup")}
          aria-label="Create a QuickHire account"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  // Authenticated — show user avatar + dropdown
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="hidden md:flex items-center gap-3 relative" ref={menuRef}>
      {/* Post a job CTA */}
      <PostJobButton className="hidden lg:inline-flex" />

      {/* Avatar toggle */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Open account menu"
        aria-expanded={menuOpen}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
      >
        <div className="w-8 h-8 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <span className="text-sm font-medium text-heading-dark hidden lg:block max-w-[120px] truncate">
          {user.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-[fadeSlideUp_0.15s_ease-out]">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-sm font-semibold text-heading-dark truncate">{user.name}</p>
            <p className="text-xs text-subtitle truncate mt-0.5">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-heading-dark hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <rect x={3} y={3} width={7} height={7} rx={1} strokeLinecap="round" /><rect x={14} y={3} width={7} height={7} rx={1} strokeLinecap="round" /><rect x={3} y={14} width={7} height={7} rx={1} strokeLinecap="round" /><rect x={14} y={14} width={7} height={7} rx={1} strokeLinecap="round" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-heading-dark hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </Link>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={async () => { setMenuOpen(false); await signOut(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
