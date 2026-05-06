"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import {
  getDashboardPathForRole,
  resendVerification,
  verifyEmail,
} from "@/services/authService";

interface Props {
  isOpen: boolean;
  email: string;
  token?: string;
  onClose: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  email,
  token,
  onClose,
}: Props) {
  const router = useRouter();
  const { setAuthenticatedUser, closeAuthModal } = useAuth();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState("");
  const [method, setMethod] = useState<"otp" | "link">("otp");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (!isOpen) return;
    setOtp("");
    setMessage(null);
    setError(null);
    setMethod(token ? "link" : "otp");
    setCooldown(60);
  }, [isOpen, email, token]);

  useEffect(() => {
    if (!isOpen || !token || !email) return;
    let cancelled = false;
    setIsSubmitting(true);
    setError(null);
    verifyEmail({ email, token })
      .then((user) => {
        if (cancelled) return;
        setAuthenticatedUser(user);
        setMessage("Email verified successfully. Redirecting...");
        router.replace(getDashboardPathForRole(user.role));
        onClose();
        closeAuthModal();
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Verification failed.");
        setMethod("otp");
      })
      .finally(() => {
        if (!cancelled) setIsSubmitting(false);
      });
    return () => {
      cancelled = true;
    };
  }, [email, isOpen, onClose, router, setAuthenticatedUser, token]);

  useEffect(() => {
    if (!isOpen || cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isOpen, cooldown]);

  if (!isOpen) return null;

  function setOtpAt(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const arr = otp.split("").slice(0, 6);
    while (arr.length < 6) arr.push("");
    arr[index] = digit;
    setOtp(arr.join(""));
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !(e.target as HTMLInputElement).value) {
      if (index > 0) inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...Array(6)].map((_, i) => pasted[i] ?? "").join("");
    setOtp(next);
    setTimeout(() => {
      const last = Math.min(pasted.length - 1, 5);
      inputsRef.current[last]?.focus();
    }, 0);
    e.preventDefault();
  }

  async function handleVerifyOtp() {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const user = await verifyEmail({ email, otp: otp.trim() });
      setAuthenticatedUser(user);
      setMessage("Email verified successfully. Redirecting...");
      router.replace(getDashboardPathForRole(user.role));
      onClose();
      closeAuthModal();
      window.dispatchEvent(new Event("qh-auth-verified"));
      return;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setMessage(null);
    setIsResending(true);
    try {
      const response = await resendVerification(email);
      setMessage(response.message);
      setCooldown(60);
      setMethod("link");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend verification email.",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-md max-h-[calc(100dvh-2rem)] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtitle">
              Email verification
            </p>
            <h3 className="mt-1 text-lg font-bold text-heading-dark">
              {method === "link"
                ? "Verify via email link"
                : "Enter 6-digit code"}
            </h3>
            <p className="mt-1 text-sm text-subtitle">Code sent to {email}</p>
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

        <div className="px-6 py-5 space-y-4 overflow-y-auto min-h-0">
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

          {method === "otp" ? (
            <>
              <div onPaste={handlePaste} className="flex justify-between gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={otp[i] ?? ""}
                    onChange={(e) => setOtpAt(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-11 h-12 rounded-lg border border-gray-300 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={isSubmitting || otp.trim().length !== 6}
                  onClick={handleVerifyOtp}
                >
                  {isSubmitting ? "Verifying..." : "Verify"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  disabled={isResending || cooldown > 0}
                  onClick={handleResend}
                >
                  {isResending
                    ? "Resending..."
                    : cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Resend"}
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setMethod("link")}
                className="w-full text-sm font-semibold text-brand-indigo hover:underline"
              >
                Verify via link instead
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-subtitle leading-relaxed">
                Open the verification link in the email we sent to {email}. When
                you click it, QuickHire will verify your account and sign you in
                automatically.
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setMethod("otp")}
                >
                  Back to OTP
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  disabled={isResending || cooldown > 0}
                  onClick={handleResend}
                >
                  {isResending
                    ? "Sending..."
                    : cooldown > 0
                      ? `Send in ${cooldown}s`
                      : "Send link again"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
