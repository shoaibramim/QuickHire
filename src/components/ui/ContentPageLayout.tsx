// Static content page wrapper — consistent layout for Terms, Privacy, Help, etc.

import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: ReactNode;
}

export default function ContentPageLayout({ title, subtitle, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading-dark mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-subtitle text-sm sm:text-base max-w-2xl">{subtitle}</p>
          )}
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-3">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="prose prose-sm sm:prose-base max-w-none text-subtitle leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
