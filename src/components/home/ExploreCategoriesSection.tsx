"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import CategoryCard from "@/components/home/CategoryCard";
import type { JobCategory } from "@/types";

export default function ExploreCategoriesSection({ categories }: { categories: JobCategory[] }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <section className="bg-white py-10 sm:py-16" aria-label="Explore jobs by category">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">

        {/* Section header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-heading-dark">
            Explore by{" "}
            <span className="text-brand-indigo">Category</span>
          </h2>

          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold text-brand-indigo hover:underline"
          >
            Show all jobs
            <FaArrowRight className="text-xs" aria-hidden="true" />
          </Link>
        </div>

        {/* Category grid */}
        <ul
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          aria-label="Job categories"
        >
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard
                label={category.label}
                jobCount={category.jobCount}
                href={category.href}
                iconKey={category.iconKey}
                isSelected={selectedCategoryId === category.id}
                onSelect={() =>
                  setSelectedCategoryId((prev) =>
                    prev === category.id ? null : category.id
                  )
                }
              />
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
