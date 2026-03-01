// Jobs listing page — /jobs
// TODO: Replace mock data with GET /api/jobs?q=...&category=...&type=... when backend is ready

import type { Metadata } from "next";
import type { FeaturedJob } from "@/types";

import JobCard from "@/components/home/JobCard";
import LatestJobRow from "@/components/home/LatestJobRow";
import { FEATURED_JOBS, LATEST_JOBS, JOB_CATEGORIES } from "@/constants/mockData";
import JobsFilterBar from "@/components/jobs/JobsFilterBar";

export const metadata: Metadata = {
  title: "Browse Jobs — QuickHire",
  description: "Explore thousands of job opportunities across all categories.",
};

interface SearchParams {
  q?: string;
  category?: string;
  type?: string;
  view?: string;
  location?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, category, type, view, location } = await searchParams;
  // Normalize query: replace hyphens with spaces so "ui-designer" matches "UI Designer"
  const query = (q ?? "").toLowerCase().replace(/-/g, " ");
  const activeCategory = category ?? "";
  const activeType = type ?? "";
  const activeView = view ?? "grid";
  const activeLocation = location ?? "";

  // Merge all jobs for the listing page, deduplicated
  const allJobs: FeaturedJob[] = [
    ...FEATURED_JOBS,
    ...LATEST_JOBS.map((j) => ({ ...j, description: `${j.company} is looking for a ${j.title} to join their team.` })),
  ];

  const filtered = allJobs.filter((job) => {
    const matchesQuery =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query);
    const matchesCategory = !category || (job.tags as string[]).includes(category);
    const matchesType = !type || job.employmentType.toLowerCase().replace(" ", "-") === type;
    const matchesLocation =
      !activeLocation ||
      job.location.toLowerCase().includes(activeLocation.replace(/-/g, " "));
    return matchesQuery && matchesCategory && matchesType && matchesLocation;
  });

  return (
    <section className="bg-white min-h-screen">
      {/* Page header */}
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-14">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading-dark mb-1">
            {query ? `Results for "${query}"` : "Browse All Jobs"}
          </h1>
          <p className="text-subtitle text-sm sm:text-base">
            Showing{" "}
            <span className="font-semibold text-heading-dark">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "job" : "jobs"}
            {category && ` in ${JOB_CATEGORIES.find((c) => c.id === category)?.label ?? category}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
        {/* Filter bar */}
        <JobsFilterBar
          categories={JOB_CATEGORIES}
          activeCategory={activeCategory}
          activeType={activeType}
          activeView={activeView}
          query={query}
          activeLocation={activeLocation}
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
            </svg>
            <p className="text-lg font-semibold text-heading-dark">No jobs found</p>
            <p className="text-subtitle text-sm max-w-xs">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        ) : activeView === "list" ? (
          <div className="grid grid-cols-1 gap-3 mt-6">
            {filtered.map((job) => (
              <LatestJobRow
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                employmentType={job.employmentType}
                companyLogoKey={job.companyLogoKey}
                tags={job.tags}
                href={`/jobs/${job.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                description={job.description}
                employmentType={job.employmentType}
                companyLogoKey={job.companyLogoKey}
                tags={job.tags}
                href={`/jobs/${job.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
