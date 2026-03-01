import Link from "next/link";
import {
  FaPencilRuler,
  FaChartBar,
  FaBullhorn,
  FaWallet,
  FaDesktop,
  FaCode,
  FaBriefcase,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import type { IconType } from "react-icons";

import type { JobCategory, CategoryIconKey } from "@/types";

const ICON_MAP: Record<CategoryIconKey, IconType> = {
  design: FaPencilRuler,
  sales: FaChartBar,
  marketing: FaBullhorn,
  finance: FaWallet,
  technology: FaDesktop,
  engineering: FaCode,
  business: FaBriefcase,
  "human-resource": FaUsers,
};

type CategoryCardProps = Pick<JobCategory, "label" | "jobCount" | "href" | "iconKey"> & {
  isSelected?: boolean;
  onSelect: () => void;
};

export default function CategoryCard({
  label,
  jobCount,
  href,
  iconKey,
  isSelected = false,
  onSelect,
}: CategoryCardProps) {
  const Icon = ICON_MAP[iconKey];

  const cardBase = "group flex flex-col justify-between p-5 sm:p-6 lg:p-8 rounded-sm border transition-all duration-200";
  const cardVariant = isSelected
    ? "bg-brand-indigo border-brand-indigo text-white"
    : "bg-white border-gray-200 hover:border-brand-indigo hover:shadow-md";

  const iconColor = isSelected ? "text-white" : "text-brand-indigo";
  const labelColor = isSelected ? "text-white" : "text-heading-dark";
  const metaColor = isSelected ? "text-indigo-200" : "text-subtitle";

  return (
    <Link
      href={href}
      onClick={onSelect}
      className={`${cardBase} ${cardVariant}`}
      aria-label={`${label} — ${jobCount} jobs available`}
      aria-current={isSelected ? "true" : undefined}
    >
      <Icon className={`text-2xl sm:text-3xl mb-4 sm:mb-6 ${iconColor}`} aria-hidden="true" />

      <div>
        <p className={`text-base sm:text-lg font-bold mb-1.5 sm:mb-2 ${labelColor}`}>{label}</p>
        <p className={`text-sm flex items-center gap-2 ${metaColor}`}>
          {jobCount} jobs available
          <FaArrowRight className="text-xs" aria-hidden="true" />
        </p>
      </div>
    </Link>
  );
}
