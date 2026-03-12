"use client";
/**
 * LocationCombobox — reusable location picker backed by world capitals.
 *
 * Idle (empty input, focused):
 *   • "Anywhere" option
 *   • First 4 capitals alphabetically
 *   • "See more" button that expands to all capitals
 *
 * Typing:
 *   • Filters all capitals for closest matches (up to 8)
 *
 * Props:
 *   value      — currently selected label string (or "" for Anywhere)
 *   onChange   — called with the label string or "" for Anywhere
 *   placeholder
 *   inputClassName — extra classes applied to the <input>
 */

import { useState, useRef, useEffect } from "react";
import { CAPITALS, INITIAL_CAPITAL_COUNT } from "@/constants/capitals";
import type { Capital } from "@/constants/capitals";

const MAX_SEARCH_RESULTS = 8;

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
}

export default function LocationCombobox({
  value,
  onChange,
  placeholder = "City or country…",
  inputClassName = "",
}: Props) {
  const [input, setInput]       = useState(value);
  const [open, setOpen]         = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  // Keep local input in sync when parent clears the value
  useEffect(() => {
    setInput(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setExpanded(false);
        setActiveIdx(-1);
        // If user blurred without selecting, revert to last committed value
        setInput(value);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [value]);

  const query = input.trim().toLowerCase();
  const isSearching = query.length > 0 && input !== value;

  // Build option list
  const searchResults: Capital[] = isSearching
    ? CAPITALS.filter(
        (c) =>
          c.city.toLowerCase().includes(query) ||
          c.country.toLowerCase().includes(query)
      ).slice(0, MAX_SEARCH_RESULTS)
    : expanded
    ? CAPITALS
    : CAPITALS.slice(0, INITIAL_CAPITAL_COUNT);

  // Keyboard navigation items (include Anywhere when not searching)
  const kbItems: Array<{ label: string; value: string }> = [
    ...(!isSearching ? [{ label: "Anywhere", value: "" }] : []),
    ...searchResults.map((c) => ({ label: c.label, value: c.label })),
  ];

  function select(val: string, label: string) {
    onChange(val);
    setInput(label);
    setOpen(false);
    setExpanded(false);
    setActiveIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        setActiveIdx(0);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, kbItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && kbItems[activeIdx]) {
        select(kbItems[activeIdx].value, kbItems[activeIdx].label);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setInput(value);
      setActiveIdx(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={input}
        placeholder={placeholder}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
          setExpanded(false);
          setActiveIdx(-1);
          // If field is cleared, emit Anywhere
          if (e.target.value === "") onChange("");
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={inputClassName}
        autoComplete="off"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-autocomplete="list"
      />

      {open && (
        <div
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          role="listbox"
          aria-label="Location options"
        >
          {!isSearching && (
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onMouseDown={() => select("", "Anywhere")}
              onMouseEnter={() => setActiveIdx(0)}
              className={[
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                value === ""
                  ? "bg-brand-indigo/5 text-brand-indigo font-semibold"
                  : activeIdx === 0
                  ? "bg-gray-50 text-heading-dark"
                  : "text-heading-dark hover:bg-gray-50",
              ].join(" ")}
            >
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx={12} cy={10} r={3} />
              </svg>
              Anywhere
              {value === "" && (
                <svg className="w-4 h-4 ml-auto flex-shrink-0 text-brand-indigo" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )}
          {!isSearching && <div className="border-t border-gray-100 mx-3" />}
          {searchResults.length === 0 && isSearching ? (
            <p className="px-4 py-3 text-sm text-subtitle">No matching cities found.</p>
          ) : (
            <ul className="max-h-52 overflow-y-auto">
              {searchResults.map((cap, idx) => {
                const kbOffset = isSearching ? idx : idx + 1; // +1 because Anywhere is at 0
                const isActive = activeIdx === kbOffset;
                const isSelected = value === cap.label;
                return (
                  <li key={cap.label}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={() => select(cap.label, cap.label)}
                      onMouseEnter={() => setActiveIdx(kbOffset)}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                        isSelected
                          ? "bg-brand-indigo/5 text-brand-indigo font-medium"
                          : isActive
                          ? "bg-gray-50 text-heading-dark"
                          : "text-heading-dark hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx={12} cy={10} r={3} />
                      </svg>
                      <span className="flex-1 text-left">
                        <span className="font-medium">{cap.city}</span>
                        <span className="text-subtitle">, {cap.country}</span>
                      </span>
                      {isSelected && (
                        <svg className="w-4 h-4 flex-shrink-0 text-brand-indigo" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {!isSearching && (
            <div className="border-t border-gray-100">
              <button
                type="button"
                onMouseDown={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-brand-indigo hover:bg-indigo-50 transition-colors"
              >
                {expanded ? "See less" : "See more"}
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
