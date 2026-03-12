import Link from "next/link";

import type { FeaturedJob } from "@/types";
import CompanyLogo from "@/components/home/CompanyLogo";
import JobTagPill from "@/components/home/JobTagPill";

/** Strip HTML tags and decode common entities for plain-text preview. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function EmploymentBadge({ label }: { label: string }) {
  return (
    <span className="text-xs font-semibold border border-brand-indigo text-brand-indigo px-3 py-1 rounded-sm whitespace-nowrap">
      {label}
    </span>
  );
}

type JobCardProps = Pick<
  FeaturedJob,
  "title" | "company" | "location" | "description" | "employmentType" | "companyLogoKey" | "tags" | "href" | "featured"
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
  featured = false,
}: JobCardProps) {
  const plainDescription = stripHtml(description);

  return (
    <Link
      href={href}
      className="flex flex-col h-full p-6 bg-white border border-gray-200 rounded-xl hover:border-brand-indigo hover:shadow-md transition-all duration-200"
      aria-label={`${title} at ${company} — ${location}`}
    >
      <div className="flex items-start justify-between mb-5">
        <CompanyLogo companyLogoKey={companyLogoKey} sizeClass="w-12 h-12" />
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <EmploymentBadge label={employmentType} />
        </div>
      </div>
      <p className="text-base font-bold text-heading-dark mb-1">{title}</p>

      {/* Company · Location */}
      <p className="text-sm text-subtitle flex items-center gap-1.5 mb-3">
        {company}
        <span aria-hidden="true" className="text-gray-300">&#x2022;</span>
        {location}
      </p>
      <p className="text-sm text-subtitle line-clamp-2 mb-5 flex-1">{plainDescription}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <JobTagPill key={tag} tagKey={tag} />
        ))}
      </div>
    </Link>
  );
}
