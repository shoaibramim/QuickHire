"use client";

// Company Profile page — /dashboard/profile
// TODO: GET /api/dashboard/profile + PUT /api/dashboard/profile

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    companyName: user?.company ?? "",
    industry: "Technology",
    website: "https://nomad.com",
    location: "Remote",
    size: "51-200",
    about: "Nomad is a remote-first platform helping teams collaborate and build asynchronously from anywhere in the world.",
    email: user?.email ?? "",
    phone: "+1 (555) 000-0000",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: await apiClient.put("/dashboard/profile", form);
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-extrabold text-heading-dark">Company Profile</h1>

      <form onSubmit={handleSave}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Avatar / logo area */}
          <div className="p-6 border-b border-gray-100 flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-brand-indigo text-2xl font-extrabold">
              {form.companyName[0] ?? "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-heading-dark">{form.companyName}</p>
              <button type="button" className="text-xs text-brand-indigo hover:underline mt-1">
                Upload company logo
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { name: "companyName", label: "Company Name", type: "text" },
              { name: "industry",    label: "Industry",      type: "text" },
              { name: "website",     label: "Website",       type: "url" },
              { name: "location",    label: "Location",      type: "text" },
              { name: "email",       label: "Contact Email", type: "email" },
              { name: "phone",       label: "Phone",         type: "tel" },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label htmlFor={`profile-${name}`} className="block text-sm font-medium text-heading-dark mb-1.5">
                  {label}
                </label>
                <input
                  id={`profile-${name}`}
                  name={name}
                  type={type}
                  value={form[name as keyof typeof form]}
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

          <div className="px-6 pb-6 flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
            {saved && <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>}
          </div>
        </div>
      </form>
    </div>
  );
}
