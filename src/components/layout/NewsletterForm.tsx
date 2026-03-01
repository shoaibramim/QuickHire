"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { FOOTER_NEWSLETTER } from "@/constants/mockData";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: POST /api/newsletter/subscribe
    setSubscribed(true);
    setEmail("");
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
          className="px-5 py-3 bg-brand-indigo text-white text-sm font-semibold rounded-r-md hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-200 whitespace-nowrap"
        >
          {FOOTER_NEWSLETTER.buttonLabel}
        </button>
      </form>
    </div>
  );
}
