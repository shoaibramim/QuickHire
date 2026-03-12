"use client";

// Company Profile page — /dashboard/profile

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";
import type { User } from "@/types/auth";
import Button from "@/components/ui/Button";
import ImageCropModal from "@/components/ui/ImageCropModal";

interface ProfileData {
  name: string;
  company: string;
  industry: string;
  website: string;
  location: string;
  size: string;
  about: string;
  email: string;
  phone: string;
  companyLogo?: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileData>({
    name:        user?.name ?? "",
    company:     user?.company ?? "",
    industry:    "Technology",
    website:     "https://nomad.com",
    location:    "Remote",
    size:        "51-200",
    about:       "Nomad is a remote-first platform helping teams collaborate and build asynchronously from anywhere in the world.",
    email:       user?.email ?? "",
    phone:       "+1 (555) 000-0000",
    companyLogo: user?.companyLogo ?? "",
  });
  const [logoPreview, setLogoPreview] = useState<string>(user?.companyLogo ?? "");
  const [cropSource, setCropSource]   = useState<string | null>(null);
  const [saved, setSaved]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Load profile from API on mount
  useEffect(() => {
    apiClient.get<ProfileData & { companyLogo?: string }>("/dashboard/profile")
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          name:    data.name    ?? prev.name,
          company: (data as any).company ?? prev.company,
          email:   (data as any).email   ?? prev.email,
          companyLogo: data.companyLogo ?? prev.companyLogo,
        }));
        if (data.companyLogo) setLogoPreview(data.companyLogo);
      })
      .catch(() => {/* use defaults */});
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    // Reset file input so the same file can be re-selected if needed
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
      const updated = await apiClient.put<User>("/dashboard/profile", {
        name:        form.name,
        company:     form.company,
        companyLogo: form.companyLogo,
        industry:    form.industry,
        website:     form.website,
        location:    form.location,
        companySize: form.size,
        about:       form.about,
        phone:       form.phone,
      } as Record<string, unknown>);
      // Keep in-memory user in sync so sidebar/navbar reflect the new logo immediately
      updateUser({
        name:        updated.name,
        company:     updated.company,
        companyLogo: updated.companyLogo,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message ?? "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  const initials = (form.company || form.name || "?")[0]?.toUpperCase() ?? "?";

  return (
    <div className="space-y-6 max-w-3xl">
      {cropSource && (
        <ImageCropModal
          imageSrc={cropSource}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
      <h1 className="text-xl font-extrabold text-heading-dark">Company Profile</h1>

      <form onSubmit={handleSave}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
              title="Click to upload company logo"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo"
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <span className="w-full h-full bg-indigo-100 flex items-center justify-center text-brand-indigo text-2xl font-extrabold">
                  {initials}
                </span>
              )}
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16 8l-4-4-4 4M12 4v12" />
                </svg>
              </span>
            </button>

            <div>
              <p className="text-sm font-semibold text-heading-dark">{form.company || form.name}</p>
              <button
                type="button"
                onClick={handleLogoClick}
                className="text-xs text-brand-indigo hover:underline mt-1"
              >
                Update Company Logo
              </button>
              <p className="text-xs text-subtitle mt-0.5">PNG, JPG, SVG or WebP · max 5 MB</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { name: "companyName" as const, label: "Company Name", type: "text",  formKey: "company" },
              { name: "industry"    as const, label: "Industry",      type: "text",  formKey: "industry" },
              { name: "website"     as const, label: "Website",       type: "url",   formKey: "website" },
              { name: "location"    as const, label: "Location",      type: "text",  formKey: "location" },
              { name: "email"       as const, label: "Contact Email", type: "email", formKey: "email" },
              { name: "phone"       as const, label: "Phone",         type: "tel",   formKey: "phone" },
            ].map(({ name, label, type, formKey }) => (
              <div key={name}>
                <label htmlFor={`profile-${name}`} className="block text-sm font-medium text-heading-dark mb-1.5">
                  {label}
                </label>
                <input
                  id={`profile-${name}`}
                  name={formKey}
                  type={type}
                  value={form[formKey as keyof ProfileData] ?? ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-heading-dark focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>
            ))}

            <div className="sm:col-span-2">
              <label htmlFor="profile-about" className="block text-sm font-medium text-heading-dark mb-1.5">
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
          </div>

          {error && (
            <div className="px-6 pb-2">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="px-6 pb-6 flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
            {saved && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
