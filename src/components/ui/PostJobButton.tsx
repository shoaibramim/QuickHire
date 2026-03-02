"use client";

/**
 * PostJobButton — shared "Post a Job" CTA used in Navbar and DashboardTopBar.
 * Navigates to /dashboard/job-listing?postJob=true which auto-opens the modal.
 */

import { useRouter } from "next/navigation";

interface Props {
  /** Extra Tailwind classes for display/sizing overrides (e.g. "hidden lg:inline-flex"). */
  className?: string;
}

export default function PostJobButton({ className = "" }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard/job-listing?postJob=true")}
      className={[
        "inline-flex items-center gap-1.5 px-4 py-2",
        "bg-brand-indigo text-white text-sm font-semibold rounded-lg",
        "hover:bg-indigo-700 transition-colors duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Post a Job
    </button>
  );
}
