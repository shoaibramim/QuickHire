// Server Component — receives live data as props from the home page.

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import LatestJobRow from "@/components/home/LatestJobRow";
import GeometricDecoration from "@/components/home/GeometricDecoration";
import type { LatestJob } from "@/types";

export default function LatestJobsSection({ jobs }: { jobs: LatestJob[] }) {
  return (
    <section className="bg-hero-bg pt-14 sm:pt-24 pb-10 sm:pb-16 lg:pt-20 relative overflow-hidden" aria-label="Latest jobs open">

      {/* Top-left cut-corner triangle — small on mobile */}
      <div
        className="block sm:hidden absolute top-0 left-0 z-20 w-0 h-0"
        style={{ borderTop: "60px solid white", borderRight: "120px solid transparent" }}
        aria-hidden="true"
      />
      {/* Top-left cut-corner triangle — full size on sm+ */}
      <div
        className="hidden sm:block absolute top-0 left-0 z-20 w-0 h-0"
        style={{ borderTop: "100px solid white", borderRight: "190px solid transparent" }}
        aria-hidden="true"
      />

      {/* Top-right geometric decoration */}
      <div className="absolute -top-10 -right-16 w-80 h-96 opacity-40 pointer-events-none" aria-hidden="true">
        <GeometricDecoration />
      </div>

      {/* Bottom-left geometric decoration — mirrored */}
      <div className="absolute -bottom-10 -left-16 w-72 h-80 opacity-25 pointer-events-none rotate-180" aria-hidden="true">
        <GeometricDecoration />
      </div>

<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">

        {/* Section header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-heading-dark">
            Latest{" "}
            <span className="text-brand-indigo">Jobs Open</span>
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
          {jobs.map((job) => (
            <li key={job.id}>
              <LatestJobRow
                title={job.title}
                company={job.company}
                location={job.location}
                employmentType={job.employmentType}
                companyLogoKey={job.companyLogoKey}
                tags={job.tags}
                href={job.href}
                featured={job.featured}
              />
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
