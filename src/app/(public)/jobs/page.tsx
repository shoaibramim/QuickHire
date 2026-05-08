// Jobs listing page /jobs
// Server Component: fetches live data from the Express API with search/filter params.

import type { Metadata } from "next";
import Link from "next/link";

import JobCard from "@/components/home/JobCard";
import LatestJobRow from "@/components/home/LatestJobRow";
import JobsFilterBar from "@/components/jobs/JobsFilterBar";
import {
  getJobs,
  getJobCategories,
  getJobsCount,
} from "@/services/jobsService";

export const metadata: Metadata = {
  title: "Browse Jobs - QuickHire",
  description: "Explore thousands of job opportunities across all categories.",
};

const PAGE_SIZE = 12;

interface SearchParams {
  q?: string;
  category?: string;
  company?: string;
  type?: string;
  view?: string;
  location?: string;
  featured?: string;
  page?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, category, company, type, view, location, featured, page } =
    await searchParams;
  const activeCategory = category ?? "";
  const activeCompany = company ?? "";
  const activeType = type ?? "";
  const activeView = view ?? "grid";
  const activeLocation = location ?? "";
  const activeFeatured = featured === "true";
  const query = q ?? "";
  const requestedPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);

  // Build API query params; filtering is done server-side
  const apiParams: Record<string, string> = {};
  if (query) apiParams["q"] = query;
  if (activeCategory) apiParams["category"] = activeCategory;
  if (activeCompany) apiParams["company"] = activeCompany;
  if (activeType) apiParams["type"] = activeType;
  if (activeLocation) apiParams["location"] = activeLocation;
  if (activeFeatured) apiParams["featured"] = "true";

  const totalJobs = await getJobsCount(apiParams);
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const pagedParams: Record<string, string> = {
    ...apiParams,
    page: String(currentPage),
    limit: String(PAGE_SIZE),
  };
  const [jobs, categories] = await Promise.all([
    getJobs(pagedParams),
    getJobCategories(),
  ]);

  const totalMatches = totalJobs > 0 ? totalJobs : jobs.length;
  const startIndex = totalMatches === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex =
    totalMatches === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, totalMatches);
  const showPagination = totalPages > 1;
  const pageNumbers = Array.from(
    new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]),
  )
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((a, b) => a - b);
  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeCategory) params.set("category", activeCategory);
    if (activeCompany) params.set("company", activeCompany);
    if (activeType) params.set("type", activeType);
    if (activeLocation) params.set("location", activeLocation);
    if (activeFeatured) params.set("featured", "true");
    if (activeView && activeView !== "grid") params.set("view", activeView);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/jobs?${qs}` : "/jobs";
  };

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
            {totalMatches === 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-heading-dark">0</span>
                {" jobs"}
              </>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-heading-dark">
                  {startIndex}-{endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-heading-dark">
                  {totalMatches}
                </span>{" "}
                {totalMatches === 1 ? "job" : "jobs"}
              </>
            )}
            {activeCategory &&
              ` in ${categories.find((c) => c.id === activeCategory)?.label ?? activeCategory}`}
            {activeCompany && ` at ${activeCompany}`}
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

        {showPagination && (
          <nav
            className="flex flex-wrap items-center justify-between gap-3 mt-10"
            aria-label="Pagination"
          >
            <p className="text-sm text-subtitle">
              Page{" "}
              <span className="font-semibold text-heading-dark">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-heading-dark">
                {totalPages}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={buildPageHref(currentPage - 1)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-subtitle hover:border-brand-indigo hover:text-brand-indigo"
                >
                  Prev
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-gray-300">
                  Prev
                </span>
              )}
              {pageNumbers.flatMap((pageNumber, index) => {
                const items: JSX.Element[] = [];
                const prev = pageNumbers[index - 1];
                if (index > 0 && prev + 1 < pageNumber) {
                  items.push(
                    <span
                      key={`gap-${pageNumber}`}
                      className="px-1 text-subtitle"
                    >
                      …
                    </span>,
                  );
                }
                if (pageNumber === currentPage) {
                  items.push(
                    <span
                      key={`page-${pageNumber}`}
                      className="px-3 py-1.5 text-xs font-semibold rounded-full border border-brand-indigo bg-brand-indigo text-white"
                    >
                      {pageNumber}
                    </span>,
                  );
                } else {
                  items.push(
                    <Link
                      key={`page-${pageNumber}`}
                      href={buildPageHref(pageNumber)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-subtitle hover:border-brand-indigo hover:text-brand-indigo"
                    >
                      {pageNumber}
                    </Link>,
                  );
                }
                return items;
              })}
              {currentPage < totalPages ? (
                <Link
                  href={buildPageHref(currentPage + 1)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-subtitle hover:border-brand-indigo hover:text-brand-indigo"
                >
                  Next
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-gray-300">
                  Next
                </span>
              )}
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}
