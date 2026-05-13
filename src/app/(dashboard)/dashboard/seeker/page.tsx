"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { useApiData } from "@/hooks/useApiData";
import type { SeekerDashboardOverview } from "@/types/dashboard";

function StatCard({
  label,
  value,
  description,
  href,
}: {
  label: string;
  value: number;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtitle">
        {label}
      </p>
      <p className="mt-3 text-4xl font-extrabold text-heading-dark leading-none">
        {value}
      </p>
      <p className="mt-2 text-sm text-subtitle">{description}</p>
    </Link>
  );
}

export default function SeekerDashboardPage() {
  const { user, signOut } = useAuth();
  const { data, isLoading } = useApiData<SeekerDashboardOverview>(
    "/dashboard/seeker/overview",
  );

  const openProfileModal = () => {
    window.dispatchEvent(new Event("qh-open-profile-modal"));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  }

  const applicationsSubmitted = data?.applicationsSubmitted ?? 0;
  const recentApplications = data?.recentApplications ?? 0;
  const shortlisted = data?.shortlisted ?? 0;
  const pendingResponses = data?.pendingResponses ?? 0;
  const recommendedJobs = (data?.recommendedJobs ?? []).slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-indigo-600 via-brand-indigo to-indigo-700 text-white p-6 sm:p-8 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.32),transparent_40%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-100/90">
              Job seeker dashboard
            </p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold">
              Welcome back, {user?.name.split(" ")[0] ?? "there"}.
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/75 leading-relaxed">
              Keep your applications moving, discover relevant openings, and
              revisit the jobs you have already applied to.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-indigo hover:bg-indigo-50 transition-colors"
            >
              Browse jobs
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Applications"
          value={applicationsSubmitted}
          description="Total applications submitted"
          href="#applications"
        />
        <StatCard
          label="Recent activity"
          value={recentApplications}
          description="Submitted in the last 30 days"
          href="#applications"
        />
        <StatCard
          label="Shortlisted"
          value={shortlisted}
          description="Applications moved forward"
          href="#applications"
        />
        <StatCard
          label="Pending"
          value={pendingResponses}
          description="Still awaiting review"
          href="#applications"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-heading-dark">
                Profile summary
              </h2>
              <p className="text-sm text-subtitle mt-1">
                Your saved details will prefill future applications.
              </p>
            </div>
            <button
              type="button"
              onClick={openProfileModal}
              className="md:hidden inline-flex items-center rounded-lg border border-brand-indigo px-3 py-1.5 text-xs font-semibold text-brand-indigo hover:bg-indigo-50 transition-colors"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <InfoRow label="Name" value={user?.name ?? "-"} />
            <InfoRow label="Email" value={user?.email ?? "-"} />
            <InfoRow label="Phone" value={user?.phone ?? "Not set"} />
            <InfoRow label="Location" value={user?.location ?? "Not set"} />
            <InfoRow
              label="Resume"
              value={user?.resumeLink ? "Saved" : "Not added yet"}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-heading-dark">
                Cover Letter
              </h2>
              <p className="text-sm text-subtitle mt-1">
                Your application form will reuse the saved cover letter.
              </p>
            </div>
            <button
              type="button"
              onClick={openProfileModal}
              className="md:hidden inline-flex items-center rounded-lg border border-brand-indigo px-3 py-1.5 text-xs font-semibold text-brand-indigo hover:bg-indigo-50 transition-colors"
            >
              Edit
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-subtitle leading-relaxed">
            {user?.coverLetterTemplate ? (
              <p>{user.coverLetterTemplate}</p>
            ) : (
              <p>
                Add a default cover letter in your profile to prefill job
                applications and save time.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          id="applications"
          className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-bold text-heading-dark">
                Recent applications
              </h2>
              <p className="text-sm text-subtitle mt-1">
                Track the status of the roles you have already applied to.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-subtitle">
              Latest updates
            </span>
          </div>

          <div className="space-y-3">
            {(data?.applicationsTimeline ?? []).length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm font-semibold text-heading-dark">
                  No applications yet
                </p>
                <p className="mt-1 text-sm text-subtitle">
                  Browse jobs and apply to start building your application
                  history.
                </p>
              </div>
            ) : (
              data?.applicationsTimeline.map((application) => (
                <Link
                  key={application.id}
                  href={application.href}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-gray-200 p-4 hover:border-brand-indigo hover:bg-indigo-50/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-heading-dark">
                      {application.title}
                    </p>
                    <p className="text-sm text-subtitle mt-0.5">
                      {application.company} · Applied {application.appliedDate}
                    </p>
                  </div>
                  <span className="inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                    {application.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-bold text-heading-dark">
                Recommended jobs
              </h2>
              <p className="text-sm text-subtitle mt-1">
                Fresh openings that match your workspace.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => (
              <Link
                key={job.id}
                href={job.href}
                className="block rounded-xl border border-gray-200 p-4 hover:border-brand-indigo hover:bg-indigo-50/40 transition-colors"
              >
                <p className="font-semibold text-heading-dark leading-snug">
                  {job.title}
                </p>
                <p className="text-sm text-subtitle mt-1">{job.company}</p>
                <p className="text-xs text-subtitle mt-1">
                  {job.location} · {job.employmentType}
                </p>
              </Link>
            ))}
            {!recommendedJobs.length && (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-subtitle">
                No recommendations are available right now. Browse the jobs
                board for fresh openings.
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link
              href="/jobs"
              className="inline-flex w-full items-center justify-center rounded-xl border border-brand-indigo px-4 py-2 text-sm font-semibold text-brand-indigo hover:bg-indigo-50 transition-colors"
            >
              See more jobs
            </Link>
          </div>
        </div>
      </section>

      <section className="md:hidden">
        <button
          type="button"
          onClick={signOut}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm hover:border-red-300 hover:bg-red-50 transition-colors"
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-subtitle">
        {label}
      </span>
      <span className="font-medium text-heading-dark truncate text-right">
        {value}
      </span>
    </div>
  );
}
