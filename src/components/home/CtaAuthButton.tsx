"use client";

// CtaAuthButton — opens the Sign Up tab of the AuthModal.
// Extracted as a client component so CtaSection remains a server component.

import { useAuth } from "@/hooks/useAuth";

interface Props {
  label: string;
}

export default function CtaAuthButton({ label }: Props) {
  const { openAuthModal } = useAuth();
  return (
    <button
      onClick={() => openAuthModal("signup")}
      className="inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white border border-white text-white bg-transparent hover:bg-white hover:text-brand-indigo active:bg-indigo-50 px-7 py-3 text-base"
    >
      {label}
    </button>
  );
}
