"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";
import type { User } from "@/types/auth";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  industry: string;
  website: string;
  companySize: string;
  about: string;
  companyLogo: string;
  resumeLink: string;
  coverLetterTemplate: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY: ProfileData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  company: "",
  industry: "",
  website: "",
  companySize: "",
  about: "",
  companyLogo: "",
  resumeLink: "",
  coverLetterTemplate: "",
};

export default function ProfileUpdateModal({ isOpen, onClose }: Props) {
  const { user, updateUser } = useAuth();
  const isEmployer = user?.role === "employer" || user?.role === "admin";
  const [form, setForm] = useState<ProfileData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user) return;
    setMessage(null);
    setError(null);
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      location: user.location ?? "",
      company: user.company ?? "",
      industry: user.industry ?? "",
      website: user.website ?? "",
      companySize: user.companySize ?? "",
      about: user.about ?? "",
      companyLogo: user.companyLogo ?? "",
      resumeLink: user.resumeLink ?? "",
      coverLetterTemplate: user.coverLetterTemplate ?? "",
    });
  }, [isOpen, user]);

  if (!isOpen) return null;

  function setField<K extends keyof ProfileData>(
    key: K,
    value: ProfileData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        phone: form.phone,
        location: form.location,
      };

      if (isEmployer) {
        payload.company = form.company;
        payload.companyLogo = form.companyLogo;
        payload.industry = form.industry;
        payload.website = form.website;
        payload.companySize = form.companySize;
        payload.about = form.about;
      } else {
        payload.resumeLink = form.resumeLink;
        payload.coverLetterTemplate = form.coverLetterTemplate;
      }

      const updated = await apiClient.put<User>("/auth/profile", payload);
      updateUser(updated);
      setMessage("Profile updated successfully.");
      window.dispatchEvent(new Event("qh-profile-updated"));
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[calc(100dvh-2rem)] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtitle">
              Update profile
            </p>
            <h3 className="mt-1 text-lg font-bold text-heading-dark">
              {isEmployer ? "Company details" : "Job seeker details"}
            </h3>
            <p className="mt-1 text-sm text-subtitle">
              Keep this info saved so job applications are prefilled.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="px-6 py-5 space-y-4 overflow-y-auto min-h-0"
        >
          {message && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Full name"
              value={form.name}
              onChange={(value) => setField("name", value)}
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(value) => setField("email", value)}
              disabled
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(value) => setField("phone", value)}
            />
            <Field
              label="Location"
              value={form.location}
              onChange={(value) => setField("location", value)}
            />

            {isEmployer ? (
              <>
                <Field
                  label="Company name"
                  value={form.company}
                  onChange={(value) => setField("company", value)}
                />
                <Field
                  label="Industry"
                  value={form.industry}
                  onChange={(value) => setField("industry", value)}
                />
                <Field
                  label="Website"
                  value={form.website}
                  onChange={(value) => setField("website", value)}
                />
                <Field
                  label="Company size"
                  value={form.companySize}
                  onChange={(value) => setField("companySize", value)}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="About"
                    value={form.about}
                    onChange={(value) => setField("about", value)}
                  />
                </div>
              </>
            ) : (
              <>
                <Field
                  label="Resume link"
                  value={form.resumeLink}
                  onChange={(value) => setField("resumeLink", value)}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Default cover note"
                    value={form.coverLetterTemplate}
                    onChange={(value) => setField("coverLetterTemplate", value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="space-y-1.5 block">
      <span className="block text-sm font-medium text-heading-dark">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo disabled:bg-gray-100 disabled:text-subtitle"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1.5 block">
      <span className="block text-sm font-medium text-heading-dark">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo resize-none"
      />
    </label>
  );
}
