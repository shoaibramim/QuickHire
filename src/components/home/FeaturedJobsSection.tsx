// Server Component — static data; no client state required.
// TODO: Replace FEATURED_JOBS with GET /api/jobs/featured when backend is ready.

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import JobCard from "@/components/home/JobCard";
import { FEATURED_JOBS } from "@/constants/mockData";

export default function FeaturedJobsSection() {
  return (
    <section className="bg-white py-10 sm:py-16" aria-label="Featured jobs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">

        {/* Section header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-heading-dark">
            Featured{" "}
            <span className="text-brand-indigo">Jobs</span>
          </h2>

          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold text-brand-indigo hover:underline"
          >
            Show all jobs
            <FaArrowRight className="text-xs" aria-hidden="true" />
          </Link>
        </div>

        {/* Job list — horizontal scroll on mobile, grid on sm+ */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          <ul
            className="flex gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4 w-max sm:w-auto"
            aria-label="Featured job listings"
          >
            {FEATURED_JOBS.map((job) => (
              <li key={job.id} className="w-[72vw] xs:w-[60vw] sm:w-auto snap-start">
                <JobCard
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  description={job.description}
                  employmentType={job.employmentType}
                  companyLogoKey={job.companyLogoKey}
                  tags={job.tags}
                  href={job.href}
                />
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
