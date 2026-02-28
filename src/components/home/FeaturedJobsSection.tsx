// Server Component — static data; no client state required.
// TODO: Replace FEATURED_JOBS with GET /api/jobs/featured when backend is ready.

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import JobCard from "@/components/home/JobCard";
import { FEATURED_JOBS } from "@/constants/mockData";

export default function FeaturedJobsSection() {
  return (
    <section className="bg-white py-16" aria-label="Featured jobs">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold text-heading-dark">
            Featured{" "}
            <span className="text-brand-indigo">jobs</span>
          </h2>

          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold text-brand-indigo hover:underline"
          >
            Show all jobs
            <FaArrowRight className="text-xs" aria-hidden="true" />
          </Link>
        </div>

        {/* Job grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          aria-label="Featured job listings"
        >
          {FEATURED_JOBS.map((job) => (
            <li key={job.id}>
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
    </section>
  );
}
