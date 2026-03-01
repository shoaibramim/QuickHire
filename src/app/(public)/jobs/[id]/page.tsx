// Job detail page — /jobs/[id]
// TODO: Replace mock data with GET /api/jobs/:id when backend is ready

import type { Metadata } from "next";
import type { FeaturedJob } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";

import CompanyLogo from "@/components/home/CompanyLogo";
import JobTagPill from "@/components/home/JobTagPill";
import ApplyForm from "@/components/jobs/ApplyForm";
import { FEATURED_JOBS, LATEST_JOBS } from "@/constants/mockData";

interface Props {
  params: Promise<{ id: string }>;
}

// Find a job from any source by id
function findJob(id: string): FeaturedJob | null {
  const all: FeaturedJob[] = [
    ...FEATURED_JOBS,
    ...LATEST_JOBS.map((j) => ({
      ...j,
      description: `${j.company} is looking for a passionate ${j.title} to join their growing team.`,
    })),
  ];
  return all.find((j) => j.id === id) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = findJob(id);
  if (!job) return { title: "Job Not Found — QuickHire" };
  return {
    title: `${job.title} at ${job.company} — QuickHire`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = findJob(id);
  if (!job) notFound();

  const description = job.description;

  const responsibilities = [
    `Lead or contribute to ${job.title.toLowerCase()} initiatives within the team.`,
    "Collaborate cross-functionally with product, engineering, and design teams.",
    "Define and track key metrics, reporting progress to stakeholders.",
    "Continuously improve processes and strategies based on data and feedback.",
    "Mentor junior team members and contribute to a positive team culture.",
  ];

  const requirements = [
    `Proven experience in ${job.tags[0] ?? "the relevant field"} role.`,
    "Strong communication and analytical skills.",
    "Ability to thrive in a fast-paced startup environment.",
    "Bachelor's degree or equivalent practical experience.",
    "Portfolio or examples of previous work (preferred).",
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-subtitle" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-indigo transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/jobs" className="hover:text-brand-indigo transition-colors">Jobs</Link>
            <span aria-hidden="true">/</span>
            <span className="text-heading-dark font-medium truncate">{job.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Job header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <CompanyLogo companyLogoKey={job.companyLogoKey} sizeClass="w-16 h-16 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-heading-dark mb-1">
                  {job.title}
                </h1>
                <p className="text-subtitle text-base mb-3">
                  {job.company} &bull; {job.location}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold border border-brand-indigo text-brand-indigo px-3 py-1 rounded-sm">
                    {job.employmentType}
                  </span>
                  {job.tags.map((tag) => (
                    <JobTagPill key={tag} tagKey={tag} />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-heading-dark mb-3">About the Role</h2>
              <p className="text-subtitle text-sm leading-relaxed">{description}</p>
            </div>

            {/* Responsibilities */}
            <div>
              <h2 className="text-lg font-bold text-heading-dark mb-3">Responsibilities</h2>
              <ul className="space-y-2">
                {responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-subtitle">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-indigo flex-shrink-0" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-lg font-bold text-heading-dark mb-3">Requirements</h2>
              <ul className="space-y-2">
                {requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-subtitle">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Apply card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
              <p className="text-sm text-subtitle mb-1">Posted by</p>
              <p className="text-base font-bold text-heading-dark mb-5">{job.company}</p>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-subtitle">Location</span>
                  <span className="font-medium text-heading-dark">{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-subtitle">Job Type</span>
                  <span className="font-medium text-heading-dark">{job.employmentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-subtitle">Category</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {job.tags.map((tag) => (
                      <JobTagPill key={tag} tagKey={tag} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply form — open to all users, no sign-in required */}
              <ApplyForm jobId={job.id} jobTitle={job.title} />

              <Link
                href="/jobs"
                className="mt-3 flex items-center justify-center text-sm text-subtitle hover:text-brand-indigo transition-colors"
              >
                ← Back to all jobs
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
