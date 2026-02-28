import Link from "next/link";

import type { LatestJob } from "@/types";
import CompanyLogo from "@/components/home/CompanyLogo";
import JobTagPill from "@/components/home/JobTagPill";

type LatestJobRowProps = Omit<LatestJob, "id">;

function EmploymentTypePill({ label }: { label: string }) {
  return (
    <span className="text-xs font-semibold bg-teal-100 text-teal-600 px-4 py-1.5 rounded-full whitespace-nowrap">
      {label}
    </span>
  );
}

export default function LatestJobRow({
  title,
  company,
  location,
  employmentType,
  companyLogoKey,
  tags,
  href,
}: LatestJobRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-xl hover:border-brand-indigo hover:shadow-md transition-all duration-200"
      aria-label={`${title} at ${company} — ${location}`}
    >
      <CompanyLogo companyLogoKey={companyLogoKey} sizeClass="w-14 h-14" />

      <div className="min-w-0 flex-1">
        <p className="text-base font-bold text-heading-dark mb-0.5">{title}</p>

        <p className="text-sm text-subtitle flex items-center gap-1.5 mb-3">
          {company}
          <span aria-hidden="true" className="text-gray-300">&#x2022;</span>
          {location}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <EmploymentTypePill label={employmentType} />
          <span className="w-px h-5 bg-gray-300 self-center" aria-hidden="true" />
          {tags.map((tag) => (
            <JobTagPill key={tag} tagKey={tag} />
          ))}
        </div>
      </div>
    </Link>
  );
}
