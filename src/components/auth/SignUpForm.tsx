"use client";

import { useState, type FormEvent } from "react";

import Button from "@/components/ui/Button";
import EmailVerificationModal from "@/components/ui/EmailVerificationModal";
import { register } from "@/services/authService";

const ROLE_OPTIONS = [
  {
    value: "employer" as const,
    label: "Employee",
    description: "Manage hiring, jobs, and applicants.",
  },
  {
    value: "jobseeker" as const,
    label: "Job Seeker",
    description: "Search jobs, apply quickly, and track activity.",
  },
];

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"employer" | "jobseeker">("jobseeker");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [verifiedHint, setVerifiedHint] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setVerifiedHint(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      setSubmittedEmail(response.email);
      setVerifiedHint(true);
      setIsVerificationModalOpen(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (verifiedHint) {
    return (
      <div className="space-y-5 text-center py-2">
        <EmailVerificationModal
          isOpen={isVerificationModalOpen}
          email={submittedEmail}
          onClose={() => setIsVerificationModalOpen(false)}
        />
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-heading-dark">
            Check your inbox
          </h3>
          <p className="text-sm text-subtitle leading-relaxed">
            We sent a verification link and a 6-digit code to{" "}
            <span className="font-semibold text-heading-dark">
              {submittedEmail}
            </span>
            . Verify your email before signing in.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => setIsVerificationModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-brand-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Verify now
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div
          role="alert"
          className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          {error}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtitle">
          Account type
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((option) => {
            const active = role === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={[
                  "text-left rounded-xl border px-4 py-4 transition-all",
                  active
                    ? "border-brand-indigo bg-indigo-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-heading-dark">
                      {option.label}
                    </p>
                    <p className="mt-1 text-xs text-subtitle leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  <span
                    className={[
                      "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border",
                      active
                        ? "border-brand-indigo bg-brand-indigo"
                        : "border-gray-300",
                    ].join(" ")}
                  >
                    {active && (
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="signup-name"
          className="block text-sm font-medium text-heading-dark mb-1.5"
        >
          Full name
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-heading-dark placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all duration-200"
        />
      </div>

      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-heading-dark mb-1.5"
        >
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-heading-dark placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium text-heading-dark mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 text-sm text-heading-dark placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 px-3.5 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="signup-confirm-password"
            className="block text-sm font-medium text-heading-dark mb-1.5"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 text-sm text-heading-dark placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute inset-y-0 right-0 px-3.5 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs leading-relaxed text-subtitle">
        We will email both a verification link and a one-time code. You will not
        be able to access the dashboard until your email is verified.
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={
          isSubmitting || !name || !email || !password || !confirmPassword
        }
        className="mt-2"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
