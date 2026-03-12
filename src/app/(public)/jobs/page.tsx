// Jobs listing page /jobs
// Server Component: fetches live data from the Express API with search/filter params.

import type { Metadata } from "next";

import JobCard from "@/components/home/JobCard";
import LatestJobRow from "@/components/home/LatestJobRow";
import JobsFilterBar from "@/components/jobs/JobsFilterBar";
import { getJobs, getJobCategories } from "@/services/jobsService";

export const metadata: Metadata = {
  title: "Browse Jobs - QuickHire",
  description: "Explore thousands of job opportunities across all categories.",
};

interface SearchParams {
  q?: string;
  category?: string;
  type?: string;
  view?: string;
  location?: string;
  featured?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, category, type, view, location, featured } = await searchParams;
  const activeCategory = category ?? "";
  const activeType = type ?? "";
  const activeView = view ?? "grid";
  const activeLocation = location ?? "";
  const activeFeatured = featured === "true";
  const query = q ?? "";

  // Build API query params; filtering is done server-side
  const apiParams: Record<string, string> = {};
  if (query) apiParams["q"] = query;
  if (activeCategory) apiParams["category"] = activeCategory;
  if (activeType) apiParams["type"] = activeType;
  if (activeLocation) apiParams["location"] = activeLocation;
  if (activeFeatured) apiParams["featured"] = "true";

  const [jobs, categories] = await Promise.all([
    getJobs(apiParams),
    getJobCategories(),
  ]);

  return (
    <section className="bg-white min-h-screen">
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-14">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading-dark mb-1">
            {activeFeatured
              ? "Featured Jobs"
              : query
                ? `Results for "${query}"`
                : "Browse All Jobs"}
          </h1>
          <p className="text-subtitle text-sm sm:text-base">
            Showing{" "}
            <span className="font-semibold text-heading-dark">
              {jobs.length}
            </span>{" "}
            {jobs.length === 1 ? "job" : "jobs"}
            {activeCategory &&
              ` in ${categories.find((c) => c.id === activeCategory)?.label ?? activeCategory}`}
          </p>
        </div>
      </div>

      <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
        <JobsFilterBar
          categories={categories}
          activeCategory={activeCategory}
          activeType={activeType}
          activeView={activeView}
          query={query}
          activeLocation={activeLocation}
          activeFeatured={activeFeatured}
        />

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <svg
              className="w-16 h-16 text-gray-200"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
              />
            </svg>
            <p className="text-lg font-semibold text-heading-dark">
              No jobs found
            </p>
            <p className="text-subtitle text-sm max-w-xs">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </div>
        ) : activeView === "list" ? (
          <div className="grid grid-cols-1 gap-3 mt-6">
            {jobs.map((job) => (
              <LatestJobRow
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                employmentType={job.employmentType}
                companyLogoKey={job.companyLogoKey}
                tags={job.tags}
                href={job.href}
                featured={job.featured}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                description={job.description}
                employmentType={job.employmentType}
                companyLogoKey={job.companyLogoKey}
                tags={job.tags}
                href={job.href}
                featured={job.featured}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
