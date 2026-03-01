"use client";

// All Applicants page — /dashboard/applicants
// TODO: GET /api/dashboard/applicants with pagination + status filter

import { useState } from "react";
import { MOCK_APPLICANTS } from "@/constants/dashboardMockData";
import type { Applicant } from "@/types/dashboard";

type StatusFilter = "All" | "Pending" | "Reviewed" | "Shortlisted" | "Rejected";

const STATUS_STYLES: Record<Applicant["status"], string> = {
  Reviewed:    "bg-blue-50  text-blue-600",
  Shortlisted: "bg-green-50 text-green-600",
  Rejected:    "bg-red-50   text-red-500",
  Pending:     "bg-amber-50 text-amber-600",
};

export default function ApplicantsPage() {
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_APPLICANTS.filter((a) => {
    const matchesStatus = filter === "All" || a.status === filter;
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <h1 className="text-xl font-extrabold text-heading-dark">All Applicants</h1>
        <p className="text-sm text-subtitle">
          <span className="font-semibold text-heading-dark">{filtered.length}</span> applicants shown
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search by name or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-white"
        />
        <div className="flex gap-1.5 flex-wrap">
          {(["All", "Pending", "Reviewed", "Shortlisted", "Rejected"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={[
                "px-3 py-2 text-xs font-semibold rounded-lg border transition-colors",
                filter === s
                  ? "bg-brand-indigo text-white border-brand-indigo"
                  : "bg-white text-subtitle border-gray-200 hover:border-brand-indigo",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Name", "Role", "Company", "Applied", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-subtitle">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const initials = a.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <span className="font-medium text-heading-dark">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-subtitle">{a.role}</td>
                    <td className="px-4 py-3 text-subtitle">{a.company}</td>
                    <td className="px-4 py-3 text-subtitle">{a.appliedDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-brand-indigo hover:underline font-medium">View</button>
                        <button className="text-xs text-subtitle hover:text-heading-dark">Schedule</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-sm text-subtitle py-12">No applicants match your filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
