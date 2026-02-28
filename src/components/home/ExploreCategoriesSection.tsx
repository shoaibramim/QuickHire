"use client";

// TODO: Replace JOB_CATEGORIES with GET /api/jobs/categories when backend is ready.

import { useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import CategoryCard from "@/components/home/CategoryCard";
import { JOB_CATEGORIES } from "@/constants/mockData";

export default function ExploreCategoriesSection() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <section className="bg-white py-16" aria-label="Explore jobs by category">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold text-heading-dark">
            Explore by{" "}
            <span className="text-brand-indigo">category</span>
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
          {JOB_CATEGORIES.map((category) => (
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
