"use client";

/**
 * SignUpLockedPanel
 * ─────────────────────────────────────────────────────────────
 * Shown when the user clicks the Sign Up tab.
 * Registration is currently invite-only; this panel communicates that clearly.
 */

import { useAuth } from "@/hooks/useAuth";

export default function SignUpLockedPanel() {
  const { openAuthModal } = useAuth();

  return (
    <div className="flex flex-col items-center text-center py-4 px-2 space-y-5">
      {/* Lock icon */}
      <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-brand-indigo"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect x={3} y={11} width={18} height={11} rx={2} strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-heading-dark">
          Sign-up is currently unavailable
        </h3>
        <p className="text-sm text-subtitle leading-relaxed max-w-xs">
          New registrations are invite-only at this time. Only users who have
          been granted access can log in. Please reach out to the QuickHire team
          if you believe you should have access.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-100" />

      {/* CTA — redirect to sign in tab */}
      <p className="text-sm text-gray-500">
        Already have access?{" "}
        <button
          type="button"
          onClick={() => openAuthModal("signin")}
          className="text-brand-indigo font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo rounded"
        >
          Sign in here
        </button>
      </p>

      {/* Contact link — TODO: wire to real contact route */}
      <a
        href="/contact"
        className="text-xs text-gray-400 hover:text-brand-indigo transition-colors duration-200"
      >
        Contact support →
      </a>
    </div>
  );
}
