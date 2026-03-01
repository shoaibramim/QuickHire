"use client";

// Job Listing page — /dashboard/job-listing
// TODO: GET /api/dashboard/jobs + POST /api/jobs (post new job)

import { useState } from "react";
import { MOCK_DASHBOARD_JOBS } from "@/constants/dashboardMockData";
import type { DashboardJob } from "@/types/dashboard";
import Button from "@/components/ui/Button";

const STATUS_STYLES: Record<DashboardJob["status"], string> = {
  Active: "bg-green-50 text-green-600",
  Closed: "bg-gray-100  text-gray-500",
  Draft:  "bg-amber-50  text-amber-600",
};

export default function JobListingPage() {
  const [jobs] = useState(MOCK_DASHBOARD_JOBS);
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-heading-dark">Job Listing</h1>
        <Button variant="primary" size="sm" onClick={() => setShowPostModal(true)}>
          + Post New Job
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active",  count: jobs.filter((j) => j.status === "Active").length,  color: "text-green-600" },
          { label: "Closed",  count: jobs.filter((j) => j.status === "Closed").length,  color: "text-gray-500" },
          { label: "Drafts",  count: jobs.filter((j) => j.status === "Draft").length,   color: "text-amber-600" },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-extrabold ${color}`}>{count}</p>
            <p className="text-xs text-subtitle mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Job listing table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Job Title", "Company", "Posted", "Applicants", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-subtitle">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-heading-dark">{job.title}</td>
                  <td className="px-4 py-3 text-subtitle">{job.company}</td>
                  <td className="px-4 py-3 text-subtitle">{job.postedDate}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-heading-dark">{job.applicants}</span>
                    <span className="text-subtitle ml-1">applicants</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[job.status]}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-brand-indigo hover:underline font-medium">Edit</button>
                      <button className="text-xs text-subtitle hover:text-red-500">Close</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Job Modal — placeholder */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowPostModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-heading-dark mb-1">Post a New Job</h2>
            <p className="text-sm text-subtitle mb-5">Fill in the details below to publish your job listing.</p>
            <div className="space-y-4">
              {["Job Title", "Company", "Location"].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-heading-dark mb-1.5">{f}</label>
                  <input className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo" placeholder={f} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="primary" size="sm" fullWidth onClick={() => setShowPostModal(false)}>
                Publish Job
              </Button>
              <Button variant="outline" size="sm" fullWidth onClick={() => setShowPostModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
