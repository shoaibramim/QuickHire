/**
 * jobsService.ts  — server-side data fetching helpers (Next.js Server Components).
 *
 * Uses native `fetch` so Next.js can apply caching/revalidation.
 * Falls back to empty arrays on error so pages never crash if the backend is down.
 */

import type { FeaturedJob, LatestJob, JobCategory } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

/** Generic server fetch — returns null on any error, never throws. */
async function serverFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    // Do NOT merge next.revalidate when the caller supplies a cache directive —
    // Next.js throws if both cache: 'no-store' and next.revalidate are present.
    const defaults: RequestInit = options?.cache ? {} : { next: { revalidate: 60 } };
    const res = await fetch(`${API}${path}`, { ...defaults, ...options });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

/** Raw shape returned by Express — MongoDB _id instead of id */
interface RawJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  companyLogoKey: string;
  tags: string[];
  description?: string;
  status: string;
  featured: boolean;
}

function toFeaturedJob(raw: RawJob): FeaturedJob {
  return {
    id: raw._id,
    title: raw.title,
    company: raw.company,
    location: raw.location,
    employmentType: raw.employmentType as FeaturedJob["employmentType"],
    companyLogoKey: raw.companyLogoKey,
    tags: raw.tags as FeaturedJob["tags"],
    description: raw.description ?? `${raw.company} is looking for a ${raw.title} to join their team.`,
    href: `/jobs/${raw._id}`,
    featured: raw.featured ?? false,
  };
}

function toLatestJob(raw: RawJob): LatestJob {
  return {
    id: raw._id,
    title: raw.title,
    company: raw.company,
    location: raw.location,
    employmentType: raw.employmentType as LatestJob["employmentType"],
    companyLogoKey: raw.companyLogoKey,
    tags: raw.tags as LatestJob["tags"],
    href: `/jobs/${raw._id}`,
    featured: raw.featured ?? false,
  };
}

export async function getFeaturedJobs(): Promise<FeaturedJob[]> {
  const data = await serverFetch<RawJob[]>("/jobs/featured");
  return (data ?? []).map(toFeaturedJob);
}

export async function getLatestJobs(): Promise<LatestJob[]> {
  const data = await serverFetch<RawJob[]>("/jobs/latest");
  return (data ?? []).map(toLatestJob);
}

export async function getJobById(id: string): Promise<FeaturedJob | null> {
  const raw = await serverFetch<RawJob>(`/jobs/${id}`);
  if (!raw) return null;
  return toFeaturedJob(raw);
}

export async function getJobs(params: Record<string, string>): Promise<FeaturedJob[]> {
  const qs = new URLSearchParams(params).toString();
  // Always fetch fresh — filtered queries must never be served from cache
  const data = await serverFetch<RawJob[]>(`/jobs${qs ? `?${qs}` : ""}`, { cache: "no-store" });
  return (data ?? []).map(toFeaturedJob);
}

interface RawCategory { _id: string; count: number }

/** Top N category slugs by job count in last 30 days → PopularTag[] for the Hero section */
export async function getPopularTags(limit = 5): Promise<{ label: string; href: string }[]> {
  const data = await serverFetch<RawCategory[]>("/jobs/categories");
  if (!data) return [];

  const LABEL_MAP: Record<string, string> = {
    design: "Design", sales: "Sales", marketing: "Marketing", finance: "Finance",
    technology: "Technology", engineering: "Engineering", business: "Business",
    "human-resource": "Human Resource",
  };

  return data
    .filter((c) => LABEL_MAP[c._id])
    .slice(0, limit)
    .map((c) => ({
      label: LABEL_MAP[c._id]!,
      href: `/jobs?category=${c._id}`,
    }));
}

/** Maps the aggregation result from Express into the JobCategory shape */
export async function getJobCategories(): Promise<JobCategory[]> {
  const data = await serverFetch<RawCategory[]>("/jobs/categories");
  if (!data) return [];

  const ICON_MAP: Record<string, JobCategory["iconKey"]> = {
    design: "design", sales: "sales", marketing: "marketing", finance: "finance",
    technology: "technology", engineering: "engineering", business: "business",
    "human-resource": "human-resource",
  };
  const LABEL_MAP: Record<string, string> = {
    design: "Design", sales: "Sales", marketing: "Marketing", finance: "Finance",
    technology: "Technology", engineering: "Engineering", business: "Business",
    "human-resource": "Human Resource",
  };

  return data
    .filter((c) => ICON_MAP[c._id])
    .map((c) => ({
      id: c._id,
      label: LABEL_MAP[c._id] ?? c._id,
      jobCount: c.count,
      href: `/jobs?category=${c._id}`,
      iconKey: ICON_MAP[c._id]!,
    }));
}
