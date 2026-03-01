import type { Metadata } from "next";
import ContentPageLayout from "@/components/ui/ContentPageLayout";

export const metadata: Metadata = {
  title: "Product Updates — QuickHire",
  description: "Stay up to date with the latest QuickHire features and improvements.",
};

const UPDATES = [
  {
    version: "v1.3.0",
    date: "March 2, 2026",
    badge: "Latest",
    changes: [
      "Launched employer dashboard with job statistics and applicant management.",
      "Added sign-in modal with JWT authentication (invite-only access).",
      "New jobs browsing page with category, type, and view filters.",
      "Completely redesigned mobile navigation with auth state awareness.",
      "Added comprehensive company profiles page.",
    ],
  },
  {
    version: "v1.2.0",
    date: "February 10, 2026",
    badge: null,
    changes: [
      "Featured jobs section with rich card layout on the home page.",
      "Latest jobs section with row layout for quick scanning.",
      "Explore job categories section with icon grid.",
      "Improved hero search bar with popular tag suggestions.",
      "Footer newsletter subscription form.",
    ],
  },
  {
    version: "v1.1.0",
    date: "January 15, 2026",
    badge: null,
    changes: [
      "Initial public launch of QuickHire landing page.",
      "Trusted companies marquee with partner logos.",
      "CTA section for employers to post jobs.",
      "Responsive design across all screen sizes.",
      "Dark footer with social media links.",
    ],
  },
];

export default function UpdatesPage() {
  return (
    <ContentPageLayout
      title="Product Updates"
      subtitle="A changelog of every improvement and new feature we ship."
    >
      <div className="space-y-8 not-prose">
        {UPDATES.map((update) => (
          <div key={update.version} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <span className="text-base font-bold text-heading-dark">{update.version}</span>
              {update.badge && (
                <span className="bg-brand-indigo text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {update.badge}
                </span>
              )}
              <span className="ml-auto text-xs text-subtitle">{update.date}</span>
            </div>
            <ul className="px-6 py-4 space-y-2">
              {update.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-subtitle">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-indigo flex-shrink-0" aria-hidden="true" />
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
