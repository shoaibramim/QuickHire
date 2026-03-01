import type { Metadata } from "next";
import ContentPageLayout from "@/components/ui/ContentPageLayout";

export const metadata: Metadata = {
  title: "Help Center — QuickHire",
  description: "Find answers to common questions about QuickHire.",
};

const FAQS = [
  { q: "How do I apply for a job?", a: "Browse jobs on the Jobs page, click any listing for details, then click 'Apply Now'. You'll need to be signed in to submit an application." },
  { q: "How do I sign in?", a: "Click the 'Login' button in the navigation bar. Enter your email and password to access your dashboard. Note: sign-up is currently invite-only." },
  { q: "How do I post a job?", a: "After signing in as an employer, go to your Dashboard and click 'Post a job'. Fill in the job details and publish." },
  { q: "Can I save jobs to apply later?", a: "Saved jobs functionality is coming soon. For now, you can bookmark the job URL in your browser." },
  { q: "How long are job listings active?", a: "Standard listings are active for 30 days. Starter plan listings are active for 7 days. Enterprise listings can be set to custom durations." },
  { q: "How do I contact a company directly?", a: "Once you've applied for a job, the employer may reach out to you via email. Direct messaging between applicants and companies is coming soon." },
  { q: "My email or password isn't working. What do I do?", a: "Click 'Forgot password?' on the sign-in form or contact us at support@quickhire.com. Only pre-authorised users can log in." },
];

export default function HelpPage() {
  return (
    <ContentPageLayout
      title="Help Center"
      subtitle="Everything you need to know about using QuickHire."
    >
      <div className="space-y-4 not-prose">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="group border border-gray-200 rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-semibold text-heading-dark hover:bg-gray-50 transition-colors">
              {faq.q}
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-subtitle leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="not-prose mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
        <p className="text-sm font-semibold text-heading-dark mb-1">Still need help?</p>
        <p className="text-sm text-subtitle">
          Our support team is ready to assist.{" "}
          <a href="/contact" className="text-brand-indigo font-semibold hover:underline">Contact us →</a>
        </p>
      </div>
    </ContentPageLayout>
  );
}
