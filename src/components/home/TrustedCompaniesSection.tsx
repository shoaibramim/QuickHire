// Server Component — static data; no client state required.
// TODO: Replace TRUSTED_COMPANIES with GET /api/companies/trusted when backend is ready.

import Image from "next/image";

import { TRUSTED_COMPANIES } from "@/constants/mockData";

export default function TrustedCompaniesSection() {
  return (
    <section
      className="bg-white py-12"
      aria-label="Companies we helped grow"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Section label */}
        <p className="text-sm text-subtitle font-normal mb-8">
          Companies we helped grow
        </p>

        {/* Logo row */}
        <ul
          className="flex flex-wrap items-center justify-between gap-x-8 gap-y-8"
          aria-label="Partner company logos"
        >
          {TRUSTED_COMPANIES.map((company) => (
            <li key={company.name} className="flex items-center justify-center">
              <Image
                src={company.logoSrc}
                alt={company.name}
                width={company.logoWidth}
                height={company.logoHeight}
                className="object-contain opacity-40 grayscale"
                draggable={false}
              />
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
