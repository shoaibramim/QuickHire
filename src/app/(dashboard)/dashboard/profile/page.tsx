"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import ImageCropModal from "@/components/ui/ImageCropModal";
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
  companyLogo?: string;
  resumeLink: string;
  coverLetterTemplate: string;
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const isEmployer = user?.role === "employer" || user?.role === "admin";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileData>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    location: user?.location ?? "",
    company: user?.company ?? "",
    industry: user?.industry ?? "",
    website: user?.website ?? "",
    companySize: user?.companySize ?? "",
    about: user?.about ?? "",
    companyLogo: user?.companyLogo ?? "",
    resumeLink: user?.resumeLink ?? "",
    coverLetterTemplate: user?.coverLetterTemplate ?? "",
  });
  const [logoPreview, setLogoPreview] = useState<string>(
    user?.companyLogo ?? "",
  );
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<User>("/auth/profile")
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          name: data.name ?? prev.name,
          email: data.email ?? prev.email,
          phone: data.phone ?? prev.phone,
          location: data.location ?? prev.location,
          company: data.company ?? prev.company,
          industry: data.industry ?? prev.industry,
          website: data.website ?? prev.website,
          companySize: data.companySize ?? prev.companySize,
          about: data.about ?? prev.about,
          companyLogo: data.companyLogo ?? prev.companyLogo,
          resumeLink: data.resumeLink ?? prev.resumeLink,
          coverLetterTemplate:
            data.coverLetterTemplate ?? prev.coverLetterTemplate,
        }));
        if (data.companyLogo) setLogoPreview(data.companyLogo);
      })
      .catch(() => undefined);
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }

  function handleLogoClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Logo image must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function handleCropConfirm(croppedDataUrl: string) {
    setLogoPreview(croppedDataUrl);
    setForm((prev) => ({ ...prev, companyLogo: croppedDataUrl }));
    setCropSource(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleCropCancel() {
    setCropSource(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        location: form.location,
        phone: form.phone,
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {cropSource && (
        <ImageCropModal
          imageSrc={cropSource}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <h1 className="text-xl font-extrabold text-heading-dark">
        {isEmployer ? "Company Profile" : "My Profile"}
      </h1>

      <form onSubmit={handleSave}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {isEmployer && (
            <div className="p-6 border-b border-gray-100 flex items-center gap-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Upload company logo"
              />
              <button
                type="button"
                onClick={handleLogoClick}
                className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-brand-indigo transition-colors group flex-shrink-0"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company logo"
                    className="w-full h-full object-contain bg-white"
                  />
                ) : (
                  <span className="w-full h-full bg-indigo-100 flex items-center justify-center text-brand-indigo text-2xl font-extrabold">
                    {(form.company || form.name || "?")[0]?.toUpperCase()}
                  </span>
                )}
              </button>

              <div>
                <p className="text-sm font-semibold text-heading-dark">
                  {form.company || form.name}
                </p>
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="text-xs text-brand-indigo hover:underline mt-1"
                >
                  Update Company Logo
                </button>
                <p className="text-xs text-subtitle mt-0.5">
                  PNG, JPG, SVG or WebP · max 5 MB
                </p>
              </div>
            </div>
          )}

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Field
              label="Email"
              name="email"
              value={form.email}
              type="email"
              onChange={handleChange}
              disabled
            />
            <Field
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <Field
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />

            {isEmployer ? (
              <>
                <Field
                  label="Company Name"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                />
                <Field
                  label="Industry"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                />
                <Field
                  label="Website"
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                />
                <Field
                  label="Company Size"
                  name="companySize"
                  value={form.companySize}
                  onChange={handleChange}
                />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="profile-about"
                    className="block text-sm font-medium text-heading-dark mb-1.5"
                  >
                    About the Company
                  </label>
                  <textarea
                    id="profile-about"
                    name="about"
                    rows={4}
                    value={form.about}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo resize-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="sm:col-span-2">
                  <Field
                    label="Resume Link"
                    name="resumeLink"
                    type="url"
                    placeholder="https://drive.google.com/your-resume"
                    value={form.resumeLink}
                    onChange={handleChange}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="profile-coverLetterTemplate"
                    className="block text-sm font-medium text-heading-dark mb-1.5"
                  >
                    Default Cover Note
                  </label>
                  <textarea
                    id="profile-coverLetterTemplate"
                    name="coverLetterTemplate"
                    rows={5}
                    value={form.coverLetterTemplate}
                    onChange={handleChange}
                    placeholder="Write a default cover note that will prefill when you apply to jobs."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="px-6 pb-2 text-sm text-red-600">{error}</div>
          )}

          <div className="px-6 pb-6 flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">Saved</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={`profile-${name}`}
        className="block text-sm font-medium text-heading-dark mb-1.5"
      >
        {label}
      </label>
      <input
        id={`profile-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo disabled:bg-gray-100 disabled:text-subtitle"
      />
    </div>
  );
}
