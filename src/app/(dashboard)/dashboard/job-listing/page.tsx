"use client";

// Job Listing page — /dashboard/job-listing

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";
import { useApiData } from "@/hooks/useApiData";
import type { DashboardJob } from "@/types/dashboard";
import Button from "@/components/ui/Button";
import RichTextEditor from "@/components/ui/RichTextEditor";
import LocationCombobox from "@/components/ui/LocationCombobox";

// Map MongoDB document shape to DashboardJob shape
interface RawDashboardJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  description: string;
  tags: string[];
  createdAt: string;
  applicantCount: number;
  status: "Active" | "Closed" | "Draft";
}

function mapJob(raw: RawDashboardJob): DashboardJob {
  return {
    id: raw._id,
    title: raw.title,
    company: raw.company,
    postedDate: new Date(raw.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    applicants: raw.applicantCount,
    status: raw.status,
  };
}

const STATUS_STYLES: Record<DashboardJob["status"], string> = {
  Active: "bg-green-50 text-green-600",
  Closed: "bg-gray-100  text-gray-500",
  Draft:  "bg-amber-50  text-amber-600",
};

const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Internship", "Contract", "Remote"];

const CATEGORIES = [
  { value: "design",         label: "Design" },
  { value: "marketing",      label: "Marketing" },
  { value: "technology",     label: "Technology" },
  { value: "engineering",    label: "Engineering" },
  { value: "business",       label: "Business" },
  { value: "finance",        label: "Finance" },
  { value: "sales",          label: "Sales" },
  { value: "human-resource", label: "Human Resource" },
];

interface PostJobForm {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  description: string;
  categories: string[];
  status: "Active" | "Draft";
}

export default function JobListingPage() {
  const { user } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const { data: rawJobs, isLoading, refetch } = useApiData<RawDashboardJob[]>("/dashboard/jobs");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Open modal when navigated here with ?postJob=true
  useEffect(() => {
    if (searchParams.get("postJob") === "true") {
      setShowPostModal(true);
      router.replace("/dashboard/job-listing");
    }
  }, [searchParams, router]);
  const jobs = (rawJobs ?? []).map(mapJob);

  const emptyForm: PostJobForm = {
    title:          "",
    company:        user?.company ?? "",
    location:       "",
    employmentType: "Full Time",
    description:    "",
    categories:     [],
    status:         "Active",
  };
  const [form, setForm]             = useState<PostJobForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryOpen, setCategoryOpen]   = useState(false);

  // Edit / close state
  const [modalMode, setModalMode]         = useState<"post" | "edit">("post");
  const [editingJobId, setEditingJobId]   = useState<string | null>(null);
  const [editLoading, setEditLoading]     = useState(false);
  const [confirmCloseId, setConfirmCloseId] = useState<string | null>(null);
  const [closingId, setClosingId]         = useState<string | null>(null);

  const filteredCategories = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(categoryInput.toLowerCase())
  );

  function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function openModal() {
    setForm({ ...emptyForm, company: user?.company ?? "" });
    setFormError(null);
    setCategoryInput("");
    setCategoryOpen(false);
    setModalMode("post");
    setEditingJobId(null);
    setShowPostModal(true);
  }

  async function openEditModal(id: string) {
    setFormError(null);
    setCategoryOpen(false);
    setEditLoading(true);
    setModalMode("edit");
    setEditingJobId(id);
    setShowPostModal(true);
    try {
      const raw = await apiClient.get<RawDashboardJob>(`/dashboard/jobs/${id}`);
      setForm({
        title:          raw.title,
        company:        raw.company,
        location:       raw.location,
        employmentType: raw.employmentType,
        description:    raw.description,
        categories:     raw.tags ?? [],
        status:         raw.status === "Closed" ? "Active" : raw.status,
      });
      setCategoryInput("");
    } catch {
      setFormError("Failed to load job details.");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleCloseJob(id: string, currentStatus: DashboardJob["status"]) {
    const nextStatus = currentStatus === "Closed" ? "Active" : "Closed";
    setClosingId(id);
    try {
      await apiClient.patch(`/dashboard/jobs/${id}`, { status: nextStatus });
      refetch();
    } catch {
      // silently ignore, table will not update
    } finally {
      setClosingId(null);
      setConfirmCloseId(null);
    }
  }

  async function handlePostJob(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim())           return setFormError("Job title is required.");
    if (!form.location.trim())        return setFormError("Location is required.");
    if (!form.employmentType.trim())  return setFormError("Employment type is required.");
    if (!stripHtml(form.description)) return setFormError("Job description is required.");
    if (!form.categories.length)      return setFormError("At least one category is required.");

    setSubmitting(true);
    setFormError(null);
    try {
      const payload: Record<string, unknown> = {
        title:          form.title.trim(),
        company:        form.company.trim() || user?.company || "My Company",
        location:       form.location.trim(),
        employmentType: form.employmentType,
        description:    form.description,
        tags:           form.categories,
        status:         form.status,
      };
      if (modalMode === "edit" && editingJobId) {
        await apiClient.patch(`/dashboard/jobs/${editingJobId}`, payload);
      } else {
        await apiClient.post("/dashboard/jobs", payload);
      }
      setShowPostModal(false);
      refetch();
    } catch (err: any) {
      setFormError(err?.message ?? (modalMode === "edit" ? "Failed to update job." : "Failed to post job. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-heading-dark">Job Listing</h1>
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
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-subtitle text-sm">
                    No jobs posted yet.{" "}
                    <button onClick={openModal} className="text-brand-indigo hover:underline font-medium">Post your first job →</button>
                  </td>
                </tr>
              ) : jobs.map((job) => (
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
                      <button
                        onClick={() => openEditModal(job.id)}
                        className="text-xs text-brand-indigo hover:underline font-medium"
                      >
                        Edit
                      </button>

                      {confirmCloseId === job.id ? (
                        // Inline confirmation row
                        <span className="flex items-center gap-1.5 text-xs">
                          <span className="text-subtitle">Sure?</span>
                          <button
                            onClick={() => handleCloseJob(job.id, job.status)}
                            disabled={closingId === job.id}
                            className="font-semibold text-red-500 hover:underline disabled:opacity-50"
                          >
                            {closingId === job.id ? "…" : "Yes"}
                          </button>
                          <button
                            onClick={() => setConfirmCloseId(null)}
                            className="text-subtitle hover:underline"
                          >
                            No
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmCloseId(job.id)}
                          className={`text-xs font-medium ${
                            job.status === "Closed"
                              ? "text-green-600 hover:underline"
                              : "text-subtitle hover:text-red-500"
                          }`}
                        >
                          {job.status === "Closed" ? "Reopen" : "Close"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Post New Job Modal ─────────────────────────────────── */}
      {showPostModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => !submitting && setShowPostModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[75vw] max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — fixed, not scrollable */}
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-heading-dark">
                {modalMode === "edit" ? "Edit Job" : "Post a New Job"}
              </h2>
              <p className="text-sm text-subtitle mt-0.5">
                {modalMode === "edit" ? "Update the details below and save your changes." : "Fill in all required fields to publish your listing."}
              </p>
            </div>
            <div className="overflow-y-auto flex-1">
            {editLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-7 h-7 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin" aria-label="Loading" />
              </div>
            ) : (
            <form onSubmit={handlePostJob} className="p-6 space-y-4">
              <div>
                <label htmlFor="post-title" className="block text-sm font-medium text-heading-dark mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="post-title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>
              <div>
                <label htmlFor="post-company" className="block text-sm font-medium text-heading-dark mb-1.5">
                  Company
                </label>
                <input
                  id="post-company"
                  name="company"
                  type="text"
                  placeholder={user?.company ?? "Your company name"}
                  value={form.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              {/* Location + Employment Type — side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading-dark mb-1.5">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <LocationCombobox
                    value={form.location}
                    onChange={(val) => setForm((p) => ({ ...p, location: val }))}
                    placeholder="Select a city…"
                    inputClassName="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  />
                </div>
                <div>
                  <label htmlFor="post-employmentType" className="block text-sm font-medium text-heading-dark mb-1.5">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="post-employmentType"
                    name="employmentType"
                    required
                    value={form.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-white"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description — rich text editor */}
              <div>
                <label className="block text-sm font-medium text-heading-dark mb-1.5">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={form.description}
                  onChange={(html) => setForm((prev) => ({ ...prev, description: html }))}
                  placeholder="Describe the role, responsibilities, and ideal candidate…"
                />
              </div>

              {/* Category — searchable dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-heading-dark mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or select a category…"
                    value={categoryInput}
                    onChange={(e) => {
                      setCategoryInput(e.target.value);
                      setCategoryOpen(true);
                    }}
                    onFocus={() => setCategoryOpen(true)}
                    onBlur={() => setTimeout(() => setCategoryOpen(false), 150)}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  />
                  <button
                    type="button"
                    onClick={() => setCategoryOpen((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {form.categories.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {form.categories.map((cat) => (
                      <span key={cat} className="inline-flex items-center gap-1 text-xs bg-brand-indigo/10 text-brand-indigo px-2.5 py-1 rounded-full font-medium">
                        {CATEGORIES.find((c) => c.value === cat)?.label ?? cat}
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, categories: p.categories.filter((c) => c !== cat) }))}
                          className="ml-0.5 hover:text-indigo-800 leading-none"
                          aria-label={`Remove ${cat}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {categoryOpen && filteredCategories.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-44 overflow-y-auto">
                    {filteredCategories.map((cat) => (
                      <li key={cat.value}>
                        <button
                          type="button"
                          onMouseDown={() => {
                            setForm((p) => ({
                              ...p,
                              categories: p.categories.includes(cat.value)
                                ? p.categories.filter((c) => c !== cat.value)
                                : [...p.categories, cat.value],
                            }));
                          }}
                          className={[
                            "w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between",
                            form.categories.includes(cat.value)
                              ? "bg-brand-indigo/5 text-brand-indigo font-medium"
                              : "text-heading-dark hover:bg-gray-50",
                          ].join(" ")}
                        >
                          {cat.label}
                          {form.categories.includes(cat.value) && (
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label htmlFor="post-status" className="block text-sm font-medium text-heading-dark mb-1.5">
                  Publish as
                </label>
                <select
                  id="post-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-white"
                >
                  <option value="Active">Active — visible to job seekers</option>
                  <option value="Draft">Draft — save for later</option>
                </select>
              </div>
              {formError && (
                <p className="text-sm text-red-500">{formError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" size="sm" fullWidth disabled={submitting}>
                  {submitting
                    ? (modalMode === "edit" ? "Saving…" : "Publishing…")
                    : modalMode === "edit"
                      ? "Save Changes"
                      : form.status === "Draft" ? "Save as Draft" : "Publish Job"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => setShowPostModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
            )}{/* end edit/post conditional */}
            </div>{/* end scrollable body */}
          </div>
        </div>
      )}
    </div>
  );
}
