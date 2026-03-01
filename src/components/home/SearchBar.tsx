"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import { LOCATION_OPTIONS, FEATURED_JOBS, LATEST_JOBS } from "@/constants/mockData";
import type { SearchFormState, LocationOption } from "@/types";

// ─── All unique job titles for live suggestions ───────────────
const ALL_JOB_TITLES: string[] = Array.from(
  new Set([
    ...FEATURED_JOBS.map((j) => j.title),
    ...LATEST_JOBS.map((j) => j.title),
  ])
).sort();

const MAX_SUGGESTIONS = 6;

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
  onSearch?: (state: SearchFormState) => void;
}

// ─── Component ────────────────────────────────────────────────

export default function SearchBar({
  defaultLocation = "",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<SearchFormState>({
    keyword: "",
    location: defaultLocation,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtered suggestions based on current keyword
  const suggestions =
    formState.keyword.trim().length > 0
      ? ALL_JOB_TITLES.filter((title) =>
          title.toLowerCase().includes(formState.keyword.toLowerCase())
        ).slice(0, MAX_SUGGESTIONS)
      : [];

  // Close suggestions when clicking outside
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  function selectSuggestion(title: string) {
    setFormState((prev) => ({ ...prev, keyword: title }));
    setShowSuggestions(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch?.(formState);
    const params = new URLSearchParams();
    if (formState.keyword.trim()) params.set("q", formState.keyword.trim());
    if (formState.location) params.set("location", formState.location);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-lg overflow-visible w-full"
        role="search"
        aria-label="Job search"
        noValidate
      >
        {/* ── Keyword field ────────────────────────────────── */}
        <label className="sr-only" htmlFor="job-keyword">
          Job title or keyword
        </label>
        <div className="flex items-center flex-1 min-w-0 px-5 gap-3 border-b sm:border-b-0 sm:border-r border-gray-100 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none overflow-hidden">
          <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            id="job-keyword"
            type="search"
            value={formState.keyword}
            onChange={(e) => {
              setFormState((prev) => ({ ...prev, keyword: e.target.value }));
              setShowSuggestions(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Job title or keyword"
            className="w-full py-4 sm:py-5 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-haspopup="listbox"
          />
        </div>

        {/* ── Location field ───────────────────────────────── */}
        <label className="sr-only" htmlFor="job-location">
          Location
        </label>
        <div className="flex items-center px-5 gap-2 border-b sm:border-b-0 sm:border-r border-gray-100 bg-white">
          <LocationPinIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="relative flex items-center">
            <select
              id="job-location"
              value={formState.location}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, location: e.target.value }))
              }
              className="appearance-none pr-5 py-4 sm:py-5 text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
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
          className="rounded-none rounded-b-xl sm:rounded-b-none sm:rounded-r-xl px-7 py-4 sm:py-5 text-sm font-bold tracking-wide whitespace-nowrap w-full sm:w-auto"
          aria-label="Search for jobs"
        >
          Search my job
        </Button>
      </form>

      {/* ── Live suggestions dropdown ─────────────────────── */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Job title suggestions"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
        >
          {suggestions.map((title, idx) => (
            <li
              key={title}
              role="option"
              aria-selected={idx === activeIndex}
              onMouseDown={() => selectSuggestion(title)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={[
                "flex items-center gap-3 px-5 py-3 text-sm cursor-pointer transition-colors duration-150",
                idx === activeIndex
                  ? "bg-indigo-50 text-brand-indigo"
                  : "text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              <SearchIcon className="w-4 h-4 text-gray-400 shrink-0" />
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

