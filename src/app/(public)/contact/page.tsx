import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — QuickHire",
  description: "Get in touch with the QuickHire team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading-dark mb-3">
            Contact Us
          </h1>
          <p className="text-subtitle text-sm sm:text-base max-w-xl">
            Have a question, feedback, or need support? We&apos;re here to help.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-heading-dark mb-4">Get in Touch</h2>
                <p className="text-subtitle text-sm leading-relaxed">
                  Whether you&apos;re a job seeker needing access, an employer with a billing question, or just want to say hello — our team typically responds within one business day.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: "email", label: "Email", value: "support@quickhire.com", href: "mailto:support@quickhire.com" },
                  { icon: "location", label: "Headquarters", value: "San Francisco, CA, USA", href: null },
                  { icon: "clock", label: "Support Hours", value: "Mon–Fri, 9am–6pm PST", href: null },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      {icon === "email" && (
                        <svg className="w-5 h-5 text-brand-indigo" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {icon === "location" && (
                        <svg className="w-5 h-5 text-brand-indigo" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {icon === "clock" && (
                        <svg className="w-5 h-5 text-brand-indigo" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-subtitle mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-heading-dark hover:text-brand-indigo transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-heading-dark">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-heading-dark mb-6">Send a Message</h2>
              <ContactForm />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
