// Server Component — data is static / from constants.
// TODO: Replace HERO_STATS with GET /api/stats when backend is ready.

import Image from "next/image";
import Link from "next/link";

import SearchBar from "@/components/home/SearchBar";
import BrushstrokeUnderline from "@/components/home/BrushstrokeUnderline";
import GeometricDecoration from "@/components/home/GeometricDecoration";
import { POPULAR_TAGS, HERO_STATS } from "@/constants/mockData";

export default function HeroSection() {
  return (
    <section
      className="relative flex-1 overflow-hidden"
      aria-label="Hero — discover jobs"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 flex items-center min-h-[calc(100vh-82px)]">

        {/* ────────────────────────────────────────────────────
            Left column — headline + search
        ──────────────────────────────────────────────────── */}
        <div className="relative z-10 w-full lg:w-[58%] pt-10 pb-20 lg:pb-0">

          {/* Headline */}
          <h1 className="font-extrabold text-heading-dark leading-[1.1] tracking-tight">
            <span className="block text-[3rem] sm:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]">
              {HERO_STATS.tagline}
            </span>
            <span className="block text-[3rem] sm:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] text-brand-blue">
              {HERO_STATS.jobCount} Jobs
            </span>
          </h1>

          {/* Brushstroke underline */}
          <BrushstrokeUnderline className="mt-1 mb-6" />

          {/* Sub-headline */}
          <p className="text-subtitle text-base lg:text-lg max-w-md leading-relaxed mb-10">
            {HERO_STATS.subtitle}
          </p>

          {/* Search bar */}
          {/* TODO: onSearch → router.push(`/jobs?q=${keyword}&loc=${location}`) */}
          <SearchBar />

          {/* Popular tags */}
          <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span className="text-sm text-subtitle font-normal">
              Popular :
            </span>
            {POPULAR_TAGS.map((tag, idx) => (
              <Link
                key={tag.href}
                href={tag.href}
                className="text-sm font-medium text-heading-dark hover:text-brand-indigo transition-colors duration-200 underline-offset-2 hover:underline"
                aria-label={`Browse ${tag.label} jobs`}
              >
                {tag.label}
                {idx < POPULAR_TAGS.length - 1 && (
                  <span className="text-subtitle ml-0.5">,</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────
            Right column — geometric art + person photo
        ──────────────────────────────────────────────────── */}
        <div
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-[44%] xl:w-[46%]"
          aria-hidden="true"
        >
          {/* Decorative shape grid */}
          <GeometricDecoration />

          {/* Hero person image — positioned bottom-center */}
          <div className="absolute bottom-0 inset-x-0 flex justify-center items-end h-full px-8 xl:px-16 pt-8">
            <Image
              src="/Smiling_Person_For_Landing_Page.png"
              alt="Smiling professional pointing, representing QuickHire job seekers"
              width={440}
              height={580}
              className="object-contain object-bottom max-h-[92%] w-auto drop-shadow-xl"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
