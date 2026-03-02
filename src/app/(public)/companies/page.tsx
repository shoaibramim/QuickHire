// Companies page — /companies
// TODO: Replace with GET /api/companies when backend is ready

import type { Metadata } from "next";
import Link from "next/link";

import { TRUSTED_COMPANIES } from "@/constants/siteData";
import CompanyLogo from "@/components/home/CompanyLogo";

export const metadata: Metadata = {
  title: "Browse Companies — QuickHire",
  description: "Discover great companies hiring on QuickHire.",
};

// Extended mock company profiles
const COMPANIES = [
  { id: "nomad", name: "Nomad", industry: "Technology", location: "Remote", employees: "51-200", openRoles: 5, description: "Nomad is a remote-first platform helping teams collaborate and build asynchronously from anywhere in the world." },
  { id: "dropbox", name: "Dropbox", industry: "Technology", location: "San Francisco, US", employees: "1000+", openRoles: 8, description: "Dropbox is a leading cloud storage and collaboration platform used by millions of teams globally." },
  { id: "revolut", name: "Revolut", industry: "Finance", location: "London, UK", employees: "5000+", openRoles: 12, description: "Revolut is the financial super-app building products to help people get more from their money." },
  { id: "netlify", name: "Netlify", industry: "Technology", location: "Remote", employees: "201-500", openRoles: 6, description: "Netlify is the platform for high-performance web apps, trusted by developers worldwide." },
  { id: "maze", name: "Maze", industry: "Design", location: "Remote", employees: "51-200", openRoles: 4, description: "Maze is a rapid testing platform empowering teams to build better products through user insights." },
  { id: "terraform", name: "Terraform", industry: "Engineering", location: "Remote", employees: "201-500", openRoles: 7, description: "HashiCorp Terraform enables teams to safely and predictably provision cloud infrastructure." },
  { id: "webflow", name: "Webflow", industry: "Technology", location: "San Francisco, US", employees: "201-500", openRoles: 9, description: "Webflow empowers designers and developers to build professional websites without writing code." },
  { id: "canva", name: "Canva", industry: "Design", location: "Sydney, Australia", employees: "1000+", openRoles: 15, description: "Canva is the world's leading graphic design platform, making design simple for everyone." },
];

export default function CompaniesPage() {
  return (
    <section className="min-h-screen">
      {/* Header */}
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-14">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading-dark mb-2">
            Browse Companies
          </h1>
          <p className="text-subtitle text-sm sm:text-base">
            Discover{" "}
            <span className="font-semibold text-heading-dark">{COMPANIES.length}</span>{" "}
            companies hiring right now
          </p>
        </div>
      </div>

      {/* Trusted companies showcase */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtitle mb-6">
            Featured Partners
          </p>
          <div className="flex flex-wrap items-center gap-8 opacity-70">
            {TRUSTED_COMPANIES.map((c) => (
              <span key={c.name} className="text-lg font-bold text-gray-400">{c.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Company grid */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANIES.map((company) => (
              <div
                key={company.id}
                className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:border-brand-indigo hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <CompanyLogo companyLogoKey={company.id} sizeClass="w-12 h-12 flex-shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-heading-dark truncate">{company.name}</h2>
                    <p className="text-xs text-subtitle">{company.industry} &bull; {company.location}</p>
                  </div>
                </div>
                <p className="text-sm text-subtitle leading-relaxed mb-5 flex-1 line-clamp-3">
                  {company.description}
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-xs text-subtitle">
                    <span className="font-semibold text-heading-dark">{company.employees}</span> employees
                  </p>
                  <Link
                    href={`/jobs?q=${company.name.toLowerCase()}`}
                    className="text-sm font-semibold text-brand-indigo hover:underline"
                  >
                    {company.openRoles} open roles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
