import type { JobTagKey } from "@/types";

const TAG_STYLE_MAP: Record<JobTagKey, string> = {
  marketing:        "bg-amber-100  text-amber-600",
  design:           "bg-teal-100   text-teal-600",
  business:         "bg-violet-100 text-violet-600",
  technology:       "bg-rose-100   text-rose-500",
  engineering:      "bg-blue-100   text-blue-600",
  finance:          "bg-green-100  text-green-600",
  sales:            "bg-orange-100 text-orange-600",
  "human-resource": "bg-indigo-100 text-indigo-600",
};

const TAG_LABELS: Record<JobTagKey, string> = {
  marketing:        "Marketing",
  design:           "Design",
  business:         "Business",
  technology:       "Technology",
  engineering:      "Engineering",
  finance:          "Finance",
  sales:            "Sales",
  "human-resource": "Human Resource",
};

export default function JobTagPill({ tagKey }: { tagKey: JobTagKey }) {
  return (
    <span className={`text-xs font-semibold px-4 py-1.5 rounded-full ${TAG_STYLE_MAP[tagKey]}`}>
      {TAG_LABELS[tagKey]}
    </span>
  );
}
