"use client";

// Settings page content shared by employer and job seeker dashboards.

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";
import Button from "@/components/ui/Button";

export default function SettingsPageContent() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    newApplicants: true,
    messages: true,
    weeklyReport: false,
    marketingEmails: false,
  });
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  async function handleSave() {
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handlePasswordUpdate() {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await apiClient.patch("/auth/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setPasswordError(
        error?.message ?? "Failed to update password. Please try again.",
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-extrabold text-heading-dark">Settings</h1>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-heading-dark">
            Account Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-subtitle mb-1">Full Name</p>
              <p className="text-sm font-medium text-heading-dark">
                {user?.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-subtitle mb-1">Email Address</p>
              <p className="text-sm font-medium text-heading-dark">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-subtitle mb-1">Account Type</p>
              <p className="text-sm font-medium text-heading-dark capitalize">
                {user?.role}
              </p>
            </div>
            <div>
              <p className="text-xs text-subtitle mb-1">Company</p>
              <p className="text-sm font-medium text-heading-dark">
                {user?.company ?? "—"}
              </p>
            </div>
          </div>
          {/* <p className="text-xs text-gray-400">
            To update your account details, please{" "}
            <a href="/contact" className="text-brand-indigo hover:underline">contact support</a>.
          </p> */}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-heading-dark">Password</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-heading-dark mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-16 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-subtitle hover:text-heading-dark"
              >
                {showPasswords ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading-dark mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-16 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-subtitle hover:text-heading-dark"
              >
                {showPasswords ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading-dark mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-16 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-subtitle hover:text-heading-dark"
              >
                {showPasswords ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-green-600 font-medium">
              {passwordSuccess}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePasswordUpdate}
            disabled={savingPassword}
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
      {/* <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
      </div> */}
    </div>
  );
}
