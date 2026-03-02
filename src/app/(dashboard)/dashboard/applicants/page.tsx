"use client";

// All Applicants page — /dashboard/applicants

import { useState } from "react";
import { useApiData } from "@/hooks/useApiData";
import type { Applicant } from "@/types/dashboard";

type StatusFilter = "All" | "Pending" | "Reviewed" | "Shortlisted" | "Rejected";

const STATUS_STYLES: Record<Applicant["status"], string> = {
  Reviewed:    "bg-blue-50  text-blue-600",
  Shortlisted: "bg-green-50 text-green-600",
  Rejected:    "bg-red-50   text-red-500",
  Pending:     "bg-amber-50 text-amber-600",
};

// ─── Applicant Detail Modal ───────────────────────────────────
function ApplicantModal({ applicant, onClose }: { applicant: Applicant; onClose: () => void }) {
  const initials = applicant.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Application from ${applicant.name}`}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-extrabold text-heading-dark">Applicant Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-indigo text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-base font-bold text-heading-dark">{applicant.name}</p>
              <p className="text-sm text-subtitle">{applicant.role} · {applicant.company}</p>
              <p className="text-xs text-subtitle mt-0.5">Applied {applicant.appliedDate}</p>
            </div>
            <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[applicant.status]}`}>
              {applicant.status}
            </span>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs font-semibold text-subtitle uppercase tracking-wider mb-1">Email</p>
              <a
                href={`mailto:${applicant.email}`}
                className="text-sm text-brand-indigo hover:underline break-all"
              >
                {applicant.email}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold text-subtitle uppercase tracking-wider mb-1">Resume / Portfolio</p>
              <a
                href={applicant.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-indigo hover:underline break-all"
              >
                {applicant.resumeLink}
              </a>
            </div>
          </div>

          {/* Cover note */}
          <div>
            <p className="text-xs font-semibold text-subtitle uppercase tracking-wider mb-1">Cover Note</p>
            {applicant.coverNote ? (
              <p className="text-sm text-heading-dark whitespace-pre-wrap bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                {applicant.coverNote}
              </p>
            ) : (
              <p className="text-sm text-subtitle italic">No cover note provided.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-heading-dark hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ApplicantsPage() {
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [viewApplicant, setViewApplicant] = useState<Applicant | null>(null);

  const { data, isLoading } = useApiData<Applicant[]>("/dashboard/applicants");
  const allApplicants = data ?? [];

  const filtered = allApplicants.filter((a) => {
    const matchesStatus = filter === "All" || a.status === filter;
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {viewApplicant && (
        <ApplicantModal applicant={viewApplicant} onClose={() => setViewApplicant(null)} />
      )}
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
                        <button
                          onClick={() => setViewApplicant(a)}
                          className="text-xs text-brand-indigo hover:underline font-medium"
                        >
                          View
                        </button>
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
