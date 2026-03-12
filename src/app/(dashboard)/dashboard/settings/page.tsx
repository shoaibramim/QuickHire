"use client";

// Settings page — /dashboard/settings

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    newApplicants: true,
    messages: true,
    weeklyReport: false,
    marketingEmails: false,
  });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-extrabold text-heading-dark">Settings</h1>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-heading-dark">Account Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-subtitle mb-1">Full Name</p>
              <p className="text-sm font-medium text-heading-dark">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-subtitle mb-1">Email Address</p>
              <p className="text-sm font-medium text-heading-dark">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-subtitle mb-1">Account Type</p>
              <p className="text-sm font-medium text-heading-dark capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-xs text-subtitle mb-1">Company</p>
              <p className="text-sm font-medium text-heading-dark">{user?.company ?? "—"}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            To update your account details, please{" "}
            <a href="/contact" className="text-brand-indigo hover:underline">contact support</a>.
          </p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-heading-dark">Password</h2>
        </div>
        <div className="p-6 space-y-4">
          {["Current Password", "New Password", "Confirm New Password"].map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium text-heading-dark mb-1.5">{label}</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                placeholder="••••••••"
              />
            </div>
          ))}
          <Button variant="outline" size="sm">
            Update Password
          </Button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-heading-dark">Email Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, value]) => {
            const labels: Record<string, string> = {
              newApplicants: "New applicant activity",
              messages: "New messages",
              weeklyReport: "Weekly performance report",
              marketingEmails: "Tips and product news",
            };
            return (
              <label key={key} className="flex items-center justify-between gap-4 cursor-pointer">
                <span className="text-sm text-heading-dark">{labels[key]}</span>
                <button
                  role="switch"
                  aria-checked={value}
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo ${value ? "bg-brand-indigo" : "bg-gray-200"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </label>
            );
          })}
        </div>
        <div className="px-6 pb-6 flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={handleSave}>Save Preferences</Button>
          {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
        </div>
      </div>
      <div className="bg-white border border-red-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100">
          <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
        </div>
        <div className="p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-heading-dark">Sign out of all devices</p>
            <p className="text-xs text-subtitle mt-0.5">This will invalidate all active sessions.</p>
          </div>
          <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
