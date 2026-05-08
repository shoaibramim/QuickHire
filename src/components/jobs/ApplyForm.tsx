"use client";

/**
 * ApplyForm — requires signed-in job seekers.
 * Submits to POST /api/jobs/:id/apply and stores the application.
 */

import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/services/apiClient";

interface Props {
  jobId: string;
  jobTitle: string;
}

interface FormFields {
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
}

interface ApplicationStatusResponse {
  applied: boolean;
  status?: string;
  appliedDate?: string;
}

const EMPTY: FormFields = {
  name: "",
  email: "",
  resume_link: "",
  cover_note: "",
};

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ApplyForm({ jobId, jobTitle }: Props) {
  const { user, openAuthModal } = useAuth();
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);
  const [appliedDate, setAppliedDate] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "jobseeker") return;
    setFields((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
      resume_link: user.resumeLink || prev.resume_link,
      cover_note: user.coverLetterTemplate || prev.cover_note,
    }));
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "jobseeker") return;
    let cancelled = false;

    async function loadStatus() {
      setCheckingStatus(true);
      try {
        const data = await apiClient.get<ApplicationStatusResponse>(
          `/jobs/${jobId}/application-status`,
        );
        if (cancelled) return;
        if (data.applied) {
          setAlreadyApplied(true);
          setAppliedStatus(data.status ?? "Pending");
          setAppliedDate(data.appliedDate ?? null);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          return;
        }
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
    };
  }, [user, jobId]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!user) {
      openAuthModal("signin");
      return;
    }

    if (alreadyApplied) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fields.email)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!isValidUrl(fields.resume_link)) {
      setError(
        "Please provide a valid resume link (must start with http:// or https://).",
      );
      return;
    }

    setLoading(true);

    try {
      await apiClient.post(
        `/jobs/${jobId}/apply`,
        fields as unknown as Record<string, unknown>,
      );
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          const payload = err.data as { status?: string } | undefined;
          setAlreadyApplied(true);
          setAppliedStatus(payload?.status ?? "Pending");
          setError(null);
          return;
        }
        if (err.status === 401 || err.status === 403) {
          openAuthModal("signin");
          setError("Please sign in with a job seeker account to apply.");
          return;
        }
        const payload = err.data as
          | { message?: string; error?: string }
          | undefined;
        setError(payload?.error ?? payload?.message ?? err.message);
        return;
      }
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <p className="text-heading-dark font-semibold text-sm">
          Sign in to apply
        </p>
        <p className="text-subtitle text-xs">
          Create a job seeker account to submit an application.
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => openAuthModal("signin")}
          >
            Sign in
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openAuthModal("signup")}
          >
            Create account
          </Button>
        </div>
      </div>
    );
  }

  // Employers should not be able to apply for jobs
  if (user?.role === "employer") {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl bg-amber-50 border border-amber-200 text-center">
        <svg
          className="w-6 h-6 text-amber-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
          />
        </svg>
        <p className="text-amber-800 font-semibold text-sm">Employer Account</p>
        <p className="text-amber-700 text-xs">
          Only job seekers can apply for positions. Switch to a job seeker
          account to apply.
        </p>
      </div>
    );
  }

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <svg
          className="animate-spin h-4 w-4 text-brand-indigo"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx={12}
            cy={12}
            r={10}
            stroke="currentColor"
            strokeWidth={4}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-xs text-subtitle">Checking application status…</p>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-6 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
        <svg
          className="w-8 h-8 text-brand-indigo"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-brand-indigo font-semibold text-sm">
          You have already applied.
        </p>
        <p className="text-indigo-700 text-xs">
          {appliedDate
            ? `Applied on ${appliedDate}.`
            : "Your application is already on record."}
          {appliedStatus ? ` Status: ${appliedStatus}.` : ""}
        </p>
        <p className="text-indigo-700 text-xs">
          Track updates in your <span className="font-semibold">dashboard</span>
          .
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-6 rounded-xl bg-green-50 border border-green-200 text-center">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-green-800 font-semibold text-sm">
          Application Submitted!
        </p>
        <p className="text-green-700 text-xs">
          Your application for <span className="font-medium">{jobTitle}</span>{" "}
          has been received. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <label
          htmlFor={`apply-name-${jobId}`}
          className="block text-xs font-medium text-heading-dark mb-1"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id={`apply-name-${jobId}`}
          name="name"
          type="text"
          required
          placeholder="Jane Doe"
          value={fields.name}
          onChange={handleChange}
          readOnly
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent placeholder-gray-400"
        />
      </div>
      <div>
        <label
          htmlFor={`apply-email-${jobId}`}
          className="block text-xs font-medium text-heading-dark mb-1"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id={`apply-email-${jobId}`}
          name="email"
          type="email"
          required
          placeholder="jane@example.com"
          value={fields.email}
          onChange={handleChange}
          readOnly
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent placeholder-gray-400"
        />
      </div>
      <div>
        <label
          htmlFor={`apply-resume-${jobId}`}
          className="block text-xs font-medium text-heading-dark mb-1"
        >
          Resume Link <span className="text-red-500">*</span>
        </label>
        <input
          id={`apply-resume-${jobId}`}
          name="resume_link"
          type="url"
          required
          placeholder="https://drive.google.com/your-resume"
          value={fields.resume_link}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent placeholder-gray-400"
        />
      </div>
      <div>
        <label
          htmlFor={`apply-cover-${jobId}`}
          className="block text-xs font-medium text-heading-dark mb-1"
        >
          Cover Note{" "}
          <span className="text-subtitle text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id={`apply-cover-${jobId}`}
          name="cover_note"
          rows={3}
          placeholder="Briefly describe why you're a great fit…"
          value={fields.cover_note}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent placeholder-gray-400 resize-none"
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx={12}
                cy={12}
                r={10}
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Submitting…
          </span>
        ) : (
          "Apply Now"
        )}
      </Button>
    </form>
  );
}
