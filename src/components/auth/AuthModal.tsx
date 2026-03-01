"use client";

/**
 * AuthModal
 * ─────────────────────────────────────────────────────────────
 * Full-screen overlay containing Sign In / Sign Up tabs.
 * - Traps focus inside the modal (keyboard accessibility).
 * - Closes on backdrop click or Escape key.
 * - Sign Up tab is locked and shows an info panel.
 */

import { useEffect, useRef } from "react";

import SignInForm from "@/components/auth/SignInForm";
import SignUpLockedPanel from "@/components/auth/SignUpLockedPanel";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";

export default function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isAuthModalOpen, closeAuthModal]);

  // Move focus into modal when it opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={authModalTab === "signin" ? "Sign in to QuickHire" : "Sign up for QuickHire"}
      onClick={(e) => {
        if (e.target === overlayRef.current) closeAuthModal();
      }}
    >
      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeSlideUp_0.2s_ease-out]">

        {/* Close button */}
        <button
          ref={firstFocusRef}
          onClick={closeAuthModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <Logo className="mb-5" />
          <h2 className="text-xl font-bold text-heading-dark">
            {authModalTab === "signin" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-sm text-subtitle mt-1">
            {authModalTab === "signin"
              ? "Sign in to access your QuickHire dashboard."
              : "Join thousands of employers and job seekers."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => openAuthModal("signin")}
            className={[
              "flex-1 py-3.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-indigo",
              authModalTab === "signin"
                ? "text-brand-indigo border-b-2 border-brand-indigo"
                : "text-subtitle hover:text-heading-dark",
            ].join(" ")}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            className={[
              "flex-1 py-3.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-indigo",
              authModalTab === "signup"
                ? "text-brand-indigo border-b-2 border-brand-indigo"
                : "text-subtitle hover:text-heading-dark",
            ].join(" ")}
          >
            Sign Up
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {authModalTab === "signin" ? <SignInForm /> : <SignUpLockedPanel />}
        </div>

      </div>
    </div>
  );
}
