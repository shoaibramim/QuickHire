"use client";

/**
 * JobsFilterBar — category, employment type and view-mode controls.
 * All filters update the URL search params for shareable/bookmark-friendly URLs.
 */

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { JobCategory } from "@/types";

const EMPLOYMENT_TYPES = [
  { label: "All Types", value: "" },
  { label: "Full Time", value: "full-time" },
  { label: "Part Time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Remote", value: "remote" },
];

interface Props {
  categories: JobCategory[];
  activeCategory: string;
  activeType: string;
  activeView: string;
  query: string;
  activeLocation?: string;
}

export default function JobsFilterBar({
  categories,
  activeCategory,
  activeType,
  activeView,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="space-y-4">
      {/* Top row: category pills + view toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam("category", "")}
            className={[
              "px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 border",
              !activeCategory
                ? "bg-brand-indigo text-white border-brand-indigo"
                : "bg-white text-subtitle border-gray-200 hover:border-brand-indigo hover:text-brand-indigo",
            ].join(" ")}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.id)}
              className={[
                "px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 border",
                activeCategory === cat.id
                  ? "bg-brand-indigo text-white border-brand-indigo"
                  : "bg-white text-subtitle border-gray-200 hover:border-brand-indigo hover:text-brand-indigo",
              ].join(" ")}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => updateParam("view", "grid")}
            aria-label="Grid view"
            className={`p-2.5 transition-colors duration-200 ${activeView !== "list" ? "bg-brand-indigo text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <rect x={0} y={0} width={6} height={6} rx={1} /><rect x={10} y={0} width={6} height={6} rx={1} /><rect x={0} y={10} width={6} height={6} rx={1} /><rect x={10} y={10} width={6} height={6} rx={1} />
            </svg>
          </button>
          <button
            onClick={() => updateParam("view", "list")}
            aria-label="List view"
            className={`p-2.5 transition-colors duration-200 ${activeView === "list" ? "bg-brand-indigo text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Employment type filter */}
      <div className="flex flex-wrap gap-2">
        {EMPLOYMENT_TYPES.map((et) => (
          <button
            key={et.value}
            onClick={() => updateParam("type", et.value)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 border",
              activeType === et.value
                ? "bg-indigo-50 text-brand-indigo border-brand-indigo"
                : "bg-white text-subtitle border-gray-200 hover:border-gray-300",
            ].join(" ")}
          >
            {et.label}
          </button>
        ))}
      </div>
    </div>
  );
}
