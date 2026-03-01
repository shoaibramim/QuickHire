"use client";

/**
 * ApplyForm — open to all users, no sign-in required.
 * Submits to POST /api/jobs/:id/apply and stores the application.
 *
 * Application model: { id, job_id, name, email, resume_link, cover_note, created_at }
 */

import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import Button from "@/components/ui/Button";

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

const EMPTY: FormFields = { name: "", email: "", resume_link: "", cover_note: "" };

export default function ApplyForm({ jobId, jobTitle }: Props) {
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-6 rounded-xl bg-green-50 border border-green-200 text-center">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-800 font-semibold text-sm">Application Submitted!</p>
        <p className="text-green-700 text-xs">
          Your application for <span className="font-medium">{jobTitle}</span> has been received. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {/* Full name */}
      <div>
        <label htmlFor={`apply-name-${jobId}`} className="block text-xs font-medium text-heading-dark mb-1">
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
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent placeholder-gray-400"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`apply-email-${jobId}`} className="block text-xs font-medium text-heading-dark mb-1">
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
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent placeholder-gray-400"
        />
      </div>

      {/* Resume link */}
      <div>
        <label htmlFor={`apply-resume-${jobId}`} className="block text-xs font-medium text-heading-dark mb-1">
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

      {/* Cover note */}
      <div>
        <label htmlFor={`apply-cover-${jobId}`} className="block text-xs font-medium text-heading-dark mb-1">
          Cover Note <span className="text-subtitle text-xs font-normal">(optional)</span>
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

      {/* Error */}
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
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
