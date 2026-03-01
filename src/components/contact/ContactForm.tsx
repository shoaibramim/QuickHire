"use client";

// ContactForm — validated form with simulated submission.
// TODO: POST /api/contact when backend is ready.

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: await apiClient.post("/contact", form);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 gap-4">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-base font-bold text-heading-dark">Message sent!</p>
        <p className="text-sm text-subtitle">We&apos;ll get back to you within one business day.</p>
        <button
          className="text-sm text-brand-indigo hover:underline"
          onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setSubmitted(false); }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-heading-dark mb-1.5">
            Full Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Maria Silva"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-heading-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-heading-dark mb-1.5">
            Email Address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="maria@example.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-heading-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-heading-dark mb-1.5">
          Subject
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-heading-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all"
        >
          <option value="">Select a subject…</option>
          <option value="access-request">Request Account Access</option>
          <option value="employer-inquiry">Employer / Hiring Inquiry</option>
          <option value="billing">Billing Question</option>
          <option value="bug-report">Report a Bug</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-heading-dark mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us how we can help…"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-heading-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all resize-none"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={submitting || !form.name || !form.email || !form.subject || !form.message}
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending…
          </span>
        ) : "Send Message"}
      </Button>
    </form>
  );
}
