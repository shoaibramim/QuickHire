"use client";

/**
 * JobsFilterBar — category, employment type, location and view-mode controls.
 * All filters update the URL search params for shareable/bookmark-friendly URLs.
 */

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import LocationCombobox from "@/components/ui/LocationCombobox";
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
  activeFeatured?: boolean;
}

export default function JobsFilterBar({
  categories,
  activeCategory,
  activeType,
  activeView,
  activeLocation = "",
  activeFeatured = false,
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

  function toggleFeatured() {
    const params = new URLSearchParams(searchParams.toString());
    if (activeFeatured) {
      params.delete("featured");
    } else {
      params.set("featured", "true");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-4">
      {/* Top row: category pills + view toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {/* Featured toggle pill */}
          <button
            onClick={toggleFeatured}
            className={[
              "px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 border flex items-center gap-1.5",
              activeFeatured
                ? "bg-amber-400 text-white border-amber-400"
                : "bg-white text-subtitle border-gray-200 hover:border-amber-400 hover:text-amber-500",
            ].join(" ")}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </button>
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

      {/* Location filter */}
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx={12} cy={10} r={3} />
        </svg>
        <div className="w-56">
          <LocationCombobox
            value={activeLocation}
            onChange={(val) => updateParam("location", val)}
            placeholder="Filter by location…"
            inputClassName="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-heading-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-white"
          />
        </div>
        {activeLocation && (
          <button
            onClick={() => updateParam("location", "")}
            className="text-xs text-subtitle hover:text-red-500 transition-colors"
            aria-label="Clear location filter"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
