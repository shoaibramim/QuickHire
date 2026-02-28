"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import Button from "@/components/ui/Button";
import { LOCATION_OPTIONS } from "@/constants/mockData";
import type { SearchFormState, LocationOption } from "@/types";

// ─── Inline icon helpers ──────────────────────────────────────

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx={12} cy={10} r={3} />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Props ────────────────────────────────────────────────────

interface SearchBarProps {
  defaultLocation?: string;
  /** TODO: Replace with router.push(`/jobs?q=...`) or API call */
  onSearch?: (state: SearchFormState) => void;
}

// ─── Component ────────────────────────────────────────────────

export default function SearchBar({
  defaultLocation = "florence-italy",
  onSearch,
}: SearchBarProps) {
  const [formState, setFormState] = useState<SearchFormState>({
    keyword: "",
    location: defaultLocation,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Replace with GET /api/jobs?q={keyword}&location={location}
    onSearch?.(formState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-stretch bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl"
      role="search"
      aria-label="Job search"
      noValidate
    >
      {/* ── Keyword field ────────────────────────────────── */}
      <label className="sr-only" htmlFor="job-keyword">
        Job title or keyword
      </label>
      <div className="flex items-center flex-1 min-w-0 px-5 gap-3 border-r border-gray-100">
        <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          id="job-keyword"
          type="search"
          value={formState.keyword}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, keyword: e.target.value }))
          }
          placeholder="Job title or keyword"
          className="w-full py-5 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
          autoComplete="off"
        />
      </div>

      {/* ── Location field ───────────────────────────────── */}
      <label className="sr-only" htmlFor="job-location">
        Location
      </label>
      <div className="flex items-center px-5 gap-2 border-r border-gray-100">
        <LocationPinIcon className="w-5 h-5 text-gray-400 shrink-0" />
        <div className="relative flex items-center">
          <select
            id="job-location"
            value={formState.location}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, location: e.target.value }))
            }
            className="appearance-none pr-5 py-5 text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
            aria-label="Select job location"
          >
            {LOCATION_OPTIONS.map((opt: LocationOption) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-0 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Submit ───────────────────────────────────────── */}
      <Button
        type="submit"
        variant="primary"
        className="rounded-none px-7 py-5 text-sm font-bold tracking-wide whitespace-nowrap"
        aria-label="Search for jobs"
      >
        Search my job
      </Button>
    </form>
  );
}
