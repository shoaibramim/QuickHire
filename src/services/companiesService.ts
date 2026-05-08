/**
 * companiesService.ts — server-side data fetching for companies list.
 */

import type { Company } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function serverFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T | null> {
  try {
    const defaults: RequestInit = options?.cache
      ? {}
      : { next: { revalidate: 60 } };
    const res = await fetch(`${API}${path}`, { ...defaults, ...options });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export interface CompaniesResponse {
  companies: Company[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getCompanies(
  params: {
    page?: number;
    limit?: number;
  } = {},
): Promise<CompaniesResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  const data = await serverFetch<CompaniesResponse>(
    `/companies${qs.toString() ? `?${qs.toString()}` : ""}`,
    { cache: "no-store" },
  );

  return (
    data ?? {
      companies: [],
      total: 0,
      page: params.page ?? 1,
      pageSize: params.limit ?? 12,
      totalPages: 1,
    }
  );
}
