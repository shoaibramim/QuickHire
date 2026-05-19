"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import LocationCombobox from "@/components/ui/LocationCombobox";
import { apiClient } from "@/services/apiClient";

import type { SearchFormState } from "@/types";

const MAX_SUGGESTIONS = 8;
const MAX_VISIBLE_SUGGESTIONS = 4;

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

interface SearchBarProps {
  defaultLocation?: string;
  onSearch?: (state: SearchFormState) => void;
}

export default function SearchBar({
  defaultLocation = "",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<
    {
      type: "title" | "category";
      label: string;
      value: string;
      count?: number;
    }[]
  >([]);
  const [formState, setFormState] = useState<SearchFormState>({
    keyword: "",
    location: defaultLocation,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<{
    type: "title" | "category";
    label: string;
    value: string;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = formState.keyword.trim();
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const data = await apiClient.get<
          {
            type: "title" | "category";
            label: string;
            value: string;
            count?: number;
          }[]
        >(`/jobs/suggestions?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const next = (data ?? []).slice(0, MAX_SUGGESTIONS);
        setSuggestions(next);
        setExpanded(false);
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setExpanded(false);
          setActiveIndex(-1);
        }
      }
    }, 200);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [formState.keyword]);

  useEffect(() => {
    if (!isFocused || suppressSuggestions) {
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(suggestions.length > 0);
  }, [isFocused, suppressSuggestions, suggestions.length]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setExpanded(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  function selectSuggestion(suggestion: {
    type: "title" | "category";
    label: string;
    value: string;
  }) {
    setFormState((prev) => ({ ...prev, keyword: suggestion.label }));
    setSelectedSuggestion(suggestion);
    setSuppressSuggestions(true);
    setShowSuggestions(false);
    setExpanded(false);
    setActiveIndex(-1);
  }

  const filteredSuggestions = selectedSuggestion
    ? suggestions.filter(
        (item) =>
          !(
            item.type === selectedSuggestion.type &&
            item.value === selectedSuggestion.value
          ),
      )
    : suggestions;
  const visibleSuggestions = expanded
    ? filteredSuggestions
    : filteredSuggestions.slice(0, MAX_VISIBLE_SUGGESTIONS);
  const hasMoreSuggestions =
    filteredSuggestions.length > MAX_VISIBLE_SUGGESTIONS;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || visibleSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, visibleSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(visibleSuggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setExpanded(false);
      setActiveIndex(-1);
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch?.(formState);
    const params = new URLSearchParams();
    const keyword = formState.keyword.trim();
    const matchedCategory = suggestions.find(
      (item) =>
        item.type === "category" &&
        item.label.toLowerCase() === keyword.toLowerCase(),
    );
    if (selectedSuggestion?.type === "category") {
      params.set("category", selectedSuggestion.value);
    } else if (matchedCategory) {
      params.set("category", matchedCategory.value);
    } else if (keyword) {
      params.set("q", keyword);
    }
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
        <div className="relative flex items-center flex-1 min-w-0 px-5 gap-3 border-b sm:border-b-0 sm:border-r border-gray-100 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none overflow-visible">
          <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            id="job-keyword"
            type="search"
            value={formState.keyword}
            onChange={(e) => {
              setFormState((prev) => ({ ...prev, keyword: e.target.value }));
              setSelectedSuggestion(null);
              setSuppressSuggestions(false);
              setShowSuggestions(true);
              setExpanded(false);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (filteredSuggestions.length > 0 && !suppressSuggestions) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              setShowSuggestions(false);
              setExpanded(false);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Job title or keyword"
            className="w-full py-4 sm:py-5 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && visibleSuggestions.length > 0}
            aria-haspopup="listbox"
          />

          {/* ── Live suggestions dropdown ─────────────────── */}
          {showSuggestions && visibleSuggestions.length > 0 && (
            <div
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
              role="listbox"
              aria-label="Job title suggestions"
            >
              <ul>
                {visibleSuggestions.map((suggestion, idx) => (
                  <li key={`${suggestion.type}-${suggestion.value}`}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={idx === activeIndex}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectSuggestion(suggestion);
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={[
                        "w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors duration-150",
                        idx === activeIndex
                          ? "bg-indigo-50 text-brand-indigo"
                          : "text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <SearchIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="flex-1 text-left truncate">
                        {suggestion.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-400">
                        {suggestion.type === "category" ? "Category" : "Title"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {hasMoreSuggestions && (
                <div className="border-t border-gray-100">
                  <button
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      setExpanded((value) => !value);
                      setActiveIndex(-1);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-brand-indigo hover:bg-indigo-50 transition-colors"
                  >
                    {expanded ? "See less" : "See more"}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Location field ───────────────────────────────── */}
        <label className="sr-only" htmlFor="job-location">
          Location
        </label>
        <div className="flex items-center px-5 gap-2 border-b sm:border-b-0 sm:border-r border-gray-100 bg-white min-w-[190px]">
          <LocationPinIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <LocationCombobox
            value={formState.location}
            onChange={(val) =>
              setFormState((prev) => ({ ...prev, location: val }))
            }
            placeholder="Location…"
            inputClassName="py-4 sm:py-5 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none w-full"
          />
        </div>

        {/* ── Submit ───────────────────────────────────────── */}
        <Button
          type="submit"
          variant="primary"
          className="rounded-none rounded-b-xl sm:rounded-bl-none sm:rounded-r-xl px-7 py-4 sm:py-5 text-sm font-bold tracking-wide whitespace-nowrap w-full sm:w-auto"
          aria-label="Search for jobs"
        >
          Search my job
        </Button>
      </form>
    </div>
  );
}
