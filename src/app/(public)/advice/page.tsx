import type { Metadata } from "next";
import Link from "next/link";
import ContentPageLayout from "@/components/ui/ContentPageLayout";

export const metadata: Metadata = {
  title: "Career Advice — QuickHire",
  description: "Expert career advice for job seekers and employers on QuickHire.",
};

const ARTICLES = [
  { slug: "#", title: "How to Write a Standout Resume in 2026", category: "Resume Tips", readTime: "5 min read" },
  { slug: "#", title: "Top 10 Interview Questions and How to Answer Them", category: "Interview Prep", readTime: "8 min read" },
  { slug: "#", title: "Negotiating Your Salary: A Complete Guide", category: "Career Growth", readTime: "7 min read" },
  { slug: "#", title: "Remote Work Best Practices for New Employees", category: "Remote Work", readTime: "6 min read" },
  { slug: "#", title: "Building a Personal Brand on LinkedIn", category: "Networking", readTime: "4 min read" },
  { slug: "#", title: "How to Transition Careers Without Starting Over", category: "Career Change", readTime: "10 min read" },
];

export default function AdvicePage() {
  return (
    <ContentPageLayout
      title="Career Advice"
      subtitle="Expert tips and guides to help you land your dream job and grow your career."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose">
        {ARTICLES.map((article) => (
          <Link
            key={article.title}
            href={article.slug}
            className="group flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:border-brand-indigo hover:shadow-md transition-all duration-200"
          >
            <span className="text-xs font-semibold text-brand-indigo uppercase tracking-wider mb-3">
              {article.category}
            </span>
            <h2 className="text-base font-bold text-heading-dark group-hover:text-brand-indigo transition-colors mb-3 leading-snug">
              {article.title}
            </h2>
            <span className="text-xs text-subtitle mt-auto">{article.readTime}</span>
          </Link>
        ))}
      </div>
    </ContentPageLayout>
  );
}
