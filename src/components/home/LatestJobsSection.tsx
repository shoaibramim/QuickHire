// Server Component — static data; no client state required.
// TODO: Replace LATEST_JOBS with GET /api/jobs/latest when backend is ready.

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import LatestJobRow from "@/components/home/LatestJobRow";
import { LATEST_JOBS } from "@/constants/mockData";

// Parallel diagonal lines rendered as corner decoration (mimics Figma design)
function DiagonalLineDecoration({ className = "" }: { className?: string }) {
  const LINES = [0, 24, 48, 72, 96] as const;

  return (
    <svg
      viewBox="0 0 160 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute pointer-events-none ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {LINES.map((offset) => (
        <line
          key={offset}
          x1={offset}
          y1={0}
          x2={offset + 140}
          y2={200}
          stroke="#C5C6E8"
          strokeWidth={1.5}
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

export default function LatestJobsSection() {
  return (
    <section className="bg-hero-bg py-16 relative overflow-hidden" aria-label="Latest jobs open">

      <DiagonalLineDecoration className="w-40 -top-4 right-12 h-48" />
      <DiagonalLineDecoration className="w-40 bottom-8 right-32 h-48 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">

        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold text-heading-dark">
            Latest{" "}
            <span className="text-brand-indigo">jobs open</span>
          </h2>

          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold text-brand-indigo hover:underline"
          >
            Show all jobs
            <FaArrowRight className="text-xs" aria-hidden="true" />
          </Link>
        </div>

        {/* Two-column job list */}
        <ul
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          aria-label="Latest job listings"
        >
          {LATEST_JOBS.map((job) => (
            <li key={job.id}>
              <LatestJobRow
                title={job.title}
                company={job.company}
                location={job.location}
                employmentType={job.employmentType}
                companyLogoKey={job.companyLogoKey}
                tags={job.tags}
                href={job.href}
              />
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
