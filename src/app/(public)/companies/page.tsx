// Companies page /companies

import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";

import { TRUSTED_COMPANIES } from "@/constants/siteData";
import CompanyLogo from "@/components/home/CompanyLogo";
import { getCompanies } from "@/services/companiesService";

export const metadata: Metadata = {
  title: "Browse Companies - QuickHire",
  description: "Discover great companies hiring on QuickHire.",
};
const PAGE_SIZE = 12;

interface SearchParams {
  page?: string;
}

function toLogoKey(name: string, companyLogo: string) {
  if (companyLogo) return companyLogo;
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);

  const initial = await getCompanies({ page: requestedPage, limit: PAGE_SIZE });
  const totalCompanies = initial.total;
  const totalPages = Math.max(1, Math.ceil(totalCompanies / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const { companies } =
    currentPage === initial.page
      ? initial
      : await getCompanies({ page: currentPage, limit: PAGE_SIZE });

  const startIndex =
    totalCompanies === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex =
    totalCompanies === 0
      ? 0
      : Math.min(currentPage * PAGE_SIZE, totalCompanies);
  const showPagination = totalPages > 1;
  const pageNumbers = Array.from(
    new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]),
  )
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((a, b) => a - b);
  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/companies?${qs}` : "/companies";
  };

  return (
    <section className="min-h-screen">
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-14">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading-dark mb-2">
            Browse Companies
          </h1>
          <p className="text-subtitle text-sm sm:text-base">
            {totalCompanies === 0 ? (
              <>
                Discover{" "}
                <span className="font-semibold text-heading-dark">0</span>
                {" companies hiring right now"}
              </>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-heading-dark">
                  {startIndex}-{endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-heading-dark">
                  {totalCompanies}
                </span>{" "}
                companies hiring right now
              </>
            )}
          </p>
        </div>
      </div>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtitle mb-6">
            Featured Partners
          </p>
          <div className="flex flex-wrap items-center gap-8 opacity-70">
            {TRUSTED_COMPANIES.map((c) => (
              <span key={c.name} className="text-lg font-bold text-gray-400">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
          {companies.length === 0 ? (
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
                No companies found
              </p>
              <p className="text-subtitle text-sm max-w-xs">
                We couldn&apos;t find any companies yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:border-brand-indigo hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <CompanyLogo
                      companyLogoKey={toLogoKey(
                        company.name,
                        company.companyLogo,
                      )}
                      sizeClass="w-12 h-12 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-heading-dark truncate">
                        {company.name}
                      </h2>
                      <p className="text-xs text-subtitle">
                        {company.industry || "General"} &bull;{" "}
                        {company.location || "Remote"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-subtitle leading-relaxed mb-5 flex-1 line-clamp-3">
                    {company.about || "No company description yet."}
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-xs text-subtitle">
                      <span className="font-semibold text-heading-dark">
                        {company.companySize || "Not set"}
                      </span>{" "}
                      employees
                    </p>
                    <Link
                      href={`/jobs?company=${encodeURIComponent(company.name)}`}
                      className="text-sm font-semibold text-brand-indigo hover:underline"
                    >
                      {company.openRoles}{" "}
                      {company.openRoles === 1 ? "open role" : "open roles"}
                    </Link>
                  </div>
                </div>
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
                  const items: ReactElement[] = [];
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
      </div>
    </section>
  );
}
