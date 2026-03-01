// Dashboard Help Center — /dashboard/help

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center — QuickHire Dashboard",
};

const HELP_TOPICS = [
  { icon: "👤", title: "Managing Your Profile", desc: "Update your company info, logo, and contact details.", href: "/dashboard/profile" },
  { icon: "💼", title: "Posting a Job", desc: "Learn how to create and publish a job listing.", href: "/dashboard/job-listing" },
  { icon: "📋", title: "Reviewing Applicants", desc: "Filter, shortlist, and communicate with candidates.", href: "/dashboard/applicants" },
  { icon: "📅", title: "Schedule & Interviews", desc: "Organise your interview schedule and events.", href: "/dashboard/schedule" },
  { icon: "💬", title: "Messaging", desc: "Send and receive messages from applicants and your team.", href: "/dashboard/messages" },
  { icon: "⚙️", title: "Account Settings", desc: "Manage notifications, password, and account preferences.", href: "/dashboard/settings" },
];

export default function DashboardHelpPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-extrabold text-heading-dark">Help Center</h1>
        <p className="text-sm text-subtitle mt-1">
          Find guidance for every part of your QuickHire dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {HELP_TOPICS.map((topic) => (
          <Link
            key={topic.title}
            href={topic.href}
            className="group flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-brand-indigo hover:shadow-md transition-all duration-200"
          >
            <span className="text-2xl flex-shrink-0">{topic.icon}</span>
            <div>
              <p className="text-sm font-bold text-heading-dark group-hover:text-brand-indigo transition-colors">
                {topic.title}
              </p>
              <p className="text-xs text-subtitle mt-0.5 leading-relaxed">{topic.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
        <p className="text-sm font-semibold text-heading-dark mb-1">Still need help?</p>
        <p className="text-sm text-subtitle mb-3">
          Our support team is available Monday through Friday, 9am–6pm PST.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo hover:underline"
        >
          Contact support →
        </Link>
      </div>
    </div>
  );
}
