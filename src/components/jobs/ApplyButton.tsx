"use client";

/**
 * ApplyButton — checks auth state before proceeding.
 * Unauthenticated users are prompted to sign in first.
 *
 * TODO (backend): POST /api/jobs/:id/apply once real backend is ready.
 */

import { useState } from "react";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  jobId: string;
  jobTitle: string;
}

export default function ApplyButton({ jobId, jobTitle }: Props) {
  const { user, openAuthModal } = useAuth();
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (applied) {
    return (
      <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Application Submitted!
      </div>
    );
  }

  async function handleApply() {
    if (!user) {
      openAuthModal("signin");
      return;
    }
    setLoading(true);
    // TODO: replace with real API call
    // await apiClient.post(`/jobs/${jobId}/apply`);
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    console.log(`Applied to job ${jobId}: ${jobTitle}`);
    setLoading(false);
    setApplied(true);
  }

  return (
    <Button
      variant="primary"
      size="md"
      fullWidth
      disabled={loading}
      onClick={handleApply}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Submitting…
        </span>
      ) : user ? (
        "Apply Now"
      ) : (
        "Sign in to Apply"
      )}
    </Button>
  );
}
