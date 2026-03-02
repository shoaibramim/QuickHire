"use client";

// Main dashboard page — fetches live overview data from the Express API.

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useApiData } from "@/hooks/useApiData";
import JobStatisticsChart from "@/components/dashboard/JobStatisticsChart";
import type { DashboardOverview } from "@/types/dashboard";

type ChartPeriod = "Week" | "Month" | "Year";
type ChartView = "Overview" | "Jobs View" | "Jobs Applied";

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({
  value,
  label,
  href,
  bg,
}: {
  value: number;
  label: string;
  href: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-4 rounded-xl px-5 py-5 text-white transition-opacity hover:opacity-90 ${bg}`}
    >
      <div>
        <p className="text-3xl font-extrabold leading-none mb-1">{value}</p>
        <p className="text-sm text-white/80 font-medium leading-snug">{label}</p>
      </div>
      <svg className="w-6 h-6 text-white/70 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ── Trend badge ───────────────────────────────────────────────
function TrendBadge({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
      <svg className={`w-3 h-3 ${up ? "" : "rotate-180"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      {Math.abs(value)}%
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<ChartPeriod>("Week");
  const [chartView, setChartView] = useState<ChartView>("Overview");

  const { data: overview, isLoading } = useApiData<DashboardOverview>("/dashboard/overview");

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = `${now.toLocaleString("default", { month: "short" })} ${now.getDate()} - ${now.toLocaleString("default", { month: "short" })} ${now.getDate() + 6}`;

  const newCandidates      = overview?.newCandidates      ?? 0;
  const scheduledToday     = overview?.scheduledToday     ?? 0;
  const messages           = overview?.messages           ?? 0;
  const jobsOpen           = overview?.jobsOpen           ?? 0;
  const totalApplicants    = overview?.totalApplicants    ?? 0;
  const chartData          = overview?.chartData          ?? [];
  const applicantBreakdown = overview?.applicantBreakdown ?? [];

  const breakdownTotal = applicantBreakdown.reduce((s, a) => s + a.count, 0) || 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-heading-dark">
            {greeting}, {user?.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-subtitle mt-0.5">
            Here is your job listings statistic report from {dateLabel}
          </p>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-heading-dark font-medium self-start">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {dateLabel}
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard value={newCandidates} label="New candidates to review" href="/dashboard/applicants" bg="bg-brand-indigo" />
        <StatCard value={scheduledToday} label="Schedule for today" href="/dashboard/schedule" bg="bg-brand-blue" />
        <StatCard value={messages} label="Messages received" href="/dashboard/messages" bg="bg-violet-500" />
      </div>

      {/* ── Middle area: chart + right stats ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Chart card */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-1">
            <div>
              <h2 className="text-base font-bold text-heading-dark">Job statistics</h2>
              <p className="text-xs text-subtitle mt-0.5">Showing Jobstatus Jul 19-25</p>
            </div>
            {/* Period tabs */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden self-start">
              {(["Week", "Month", "Year"] as ChartPeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors ${period === p ? "bg-brand-indigo text-white" : "text-subtitle hover:text-heading-dark"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chart view tabs */}
          <div className="flex gap-4 mb-4 border-b border-gray-100 pb-3">
            {(["Overview", "Jobs View", "Jobs Applied"] as ChartView[]).map((v) => (
              <button
                key={v}
                onClick={() => setChartView(v)}
                className={`text-xs font-semibold pb-1 transition-colors border-b-2 ${chartView === v ? "text-brand-indigo border-brand-indigo" : "text-subtitle border-transparent hover:text-heading-dark"}`}
              >
                {v}
              </button>
            ))}
          </div>

          <JobStatisticsChart data={chartData} />
        </div>

        {/* Right stats */}
        <div className="flex flex-col gap-4">
          {/* Jobs Open */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-subtitle uppercase tracking-wider">Job Open</h3>
              <span className="text-xs text-brand-indigo font-semibold cursor-pointer hover:underline">
                <Link href="/dashboard/job-listing">See all</Link>
              </span>
            </div>
            <p className="text-5xl font-extrabold text-heading-dark leading-none mt-2 mb-1">{jobsOpen}</p>
            <p className="text-sm text-subtitle">Jobs Opened</p>
          </div>

          {/* Applicants Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-heading-dark">Applicants Summary</h3>
            </div>
            <p className="text-4xl font-extrabold text-heading-dark leading-none mb-3">{totalApplicants}</p>
            <p className="text-sm text-subtitle mb-4">Applicants</p>

            {/* Progress bar */}
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
              {applicantBreakdown.map((item) => (
                <div
                  key={item.label}
                  className={`${item.color} transition-all`}
                  style={{ width: `${(item.count / breakdownTotal) * 100}%` }}
                  title={`${item.label}: ${item.count}`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {applicantBreakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} aria-hidden="true" />
                  <span className="text-xs text-subtitle">{item.label}</span>
                  <span className="text-xs font-semibold text-heading-dark ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
