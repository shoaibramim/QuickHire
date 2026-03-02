"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { FOOTER_NEWSLETTER } from "@/constants/siteData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Please try again.");
      } else {
        setSubscribed(true);
        setEmail("");
      }
    } catch {
      setError("Unable to subscribe. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (subscribed) {
    return (
      <div>
        <h3 className="text-white font-semibold text-base mb-3">
          {FOOTER_NEWSLETTER.heading}
        </h3>
        <div className="flex items-center gap-2 px-4 py-3 bg-green-600/20 border border-green-500/40 rounded-md">
          <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-400 text-sm font-medium">You&apos;re subscribed!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-white font-semibold text-base mb-3">
        {FOOTER_NEWSLETTER.heading}
      </h3>
      <p className="text-gray-400 text-sm mb-5 leading-relaxed">
        {FOOTER_NEWSLETTER.subtext}
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex items-stretch gap-0"
        aria-label="Newsletter subscription form"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={FOOTER_NEWSLETTER.inputPlaceholder}
          className="flex-1 min-w-0 px-4 py-3 bg-white text-sm text-gray-800 placeholder-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-indigo"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-brand-indigo text-white text-sm font-semibold rounded-r-md hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-200 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Subscribing…" : FOOTER_NEWSLETTER.buttonLabel}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-red-400 text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
