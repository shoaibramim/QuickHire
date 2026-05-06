"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import EmailVerificationModal from "@/components/ui/EmailVerificationModal";

export default function VerificationPortal() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const verify = searchParams.get("verify") === "1";

  const isOpen = useMemo(
    () => Boolean(email && (token || verify)),
    [email, token, verify],
  );

  if (!isOpen) return null;

  return (
    <EmailVerificationModal
      isOpen={isOpen}
      email={email}
      token={token || undefined}
      onClose={() => {
        // The modal closes by clearing the query params in place.
        const url = new URL(window.location.href);
        url.searchParams.delete("email");
        url.searchParams.delete("token");
        url.searchParams.delete("verify");
        window.history.replaceState({}, "", url.pathname + url.search);
      }}
    />
  );
}
