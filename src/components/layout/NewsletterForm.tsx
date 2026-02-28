"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { FOOTER_NEWSLETTER } from "@/constants/mockData";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: POST /api/newsletter/subscribe
    setEmail("");
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
