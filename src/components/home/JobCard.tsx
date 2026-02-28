import Link from "next/link";

import type { FeaturedJob } from "@/types";
import CompanyLogo from "@/components/home/CompanyLogo";
import JobTagPill from "@/components/home/JobTagPill";

function EmploymentBadge({ label }: { label: string }) {
  return (
    <span className="text-xs font-semibold border border-brand-indigo text-brand-indigo px-3 py-1 rounded-sm whitespace-nowrap">
      {label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────

type JobCardProps = Pick<
  FeaturedJob,
  "title" | "company" | "location" | "description" | "employmentType" | "companyLogoKey" | "tags" | "href"
>;

export default function JobCard({
  title,
  company,
  location,
  description,
  employmentType,
  companyLogoKey,
  tags,
  href,
}: JobCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:border-brand-indigo hover:shadow-md transition-all duration-200"
      aria-label={`${title} at ${company} — ${location}`}
    >
      {/* Logo + employment type row */}
      <div className="flex items-start justify-between mb-5">
        <CompanyLogo companyLogoKey={companyLogoKey} sizeClass="w-12 h-12" />
        <EmploymentBadge label={employmentType} />
      </div>

      {/* Job title */}
      <p className="text-base font-bold text-heading-dark mb-1">{title}</p>

      {/* Company · Location */}
      <p className="text-sm text-subtitle flex items-center gap-1.5 mb-3">
        {company}
        <span aria-hidden="true" className="text-gray-300">&#x2022;</span>
        {location}
      </p>

      {/* Description */}
      <p className="text-sm text-subtitle line-clamp-2 mb-5 flex-1">{description}</p>

      {/* Category tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <JobTagPill key={tag} tagKey={tag} />
        ))}
      </div>
    </Link>
  );
}
