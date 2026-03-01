"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { NAV_LINKS } from "@/constants/mockData";
import { useAuth } from "@/hooks/useAuth";

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="w-6 h-6 text-heading-dark"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1={18} y1={6} x2={6} y2={18} />
          <line x1={6} y1={6} x2={18} y2={18} />
        </>
      ) : (
        <>
          <line x1={3} y1={6} x2={21} y2={6} />
          <line x1={3} y1={12} x2={21} y2={12} />
          <line x1={3} y1={18} x2={21} y2={18} />
        </>
      )}
    </svg>
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { user, openAuthModal, signOut } = useAuth();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden" ref={drawerRef}>
      {/* Hamburger toggle */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
      >
        <HamburgerIcon open={open} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-down drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-label="Mobile navigation"
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-xl px-6 pt-5 pb-8 transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Drawer header row */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg font-extrabold text-heading-dark">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <HamburgerIcon open={true} />
          </button>
        </div>

        {/* Nav links */}
        <ul className="space-y-1" role="list" aria-label="Mobile site navigation">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-heading-dark hover:bg-indigo-50 hover:text-brand-indigo transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth actions */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
          {user ? (
            <>
              {/* Authenticated state */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-heading-dark truncate">{user.name}</p>
                  <p className="text-xs text-subtitle truncate">{user.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 rounded-lg bg-brand-indigo text-white font-semibold text-sm hover:bg-indigo-700 transition-colors duration-200"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={async () => { setOpen(false); await signOut(); }}
                className="block w-full text-center px-4 py-3 rounded-lg border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              {/* Unauthenticated state */}
              <button
                onClick={() => { setOpen(false); openAuthModal("signin"); }}
                className="block text-center px-4 py-3 rounded-lg border border-brand-indigo text-brand-indigo font-semibold text-sm hover:bg-indigo-50 transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => { setOpen(false); openAuthModal("signup"); }}
                className="block text-center px-4 py-3 rounded-lg bg-brand-indigo text-white font-semibold text-sm hover:bg-indigo-700 transition-colors duration-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
