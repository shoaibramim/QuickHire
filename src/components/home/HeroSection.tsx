import Image from "next/image";
import Link from "next/link";

import SearchBar from "@/components/home/SearchBar";
import BrushstrokeUnderline from "@/components/home/BrushstrokeUnderline";
import HeroGeometricDecoration from "@/components/home/HeroGeometricDecoration";
import { HERO_STATS } from "@/constants/siteData";
import type { PopularTag } from "@/types";

interface HeroSectionProps {
  popularTags: PopularTag[];
}

export default function HeroSection({ popularTags }: HeroSectionProps) {
  return (
    <section className="relative flex-1" aria-label="Hero — discover jobs">
      <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 flex items-center min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-82px)]">
        <div className="relative z-10 w-full md:w-[80%] lg:w-[58%] xl:w-[52%] pt-8 sm:pt-10 pb-14 sm:pb-20 lg:pb-0">
          {/* Headline */}
          <h1 className="font-extrabold text-heading-dark leading-[1.1] tracking-tight">
            <span className="block text-[2.25rem] xs:text-[2.75rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[5.5rem]">
              Discover
            </span>
            <span className="block text-[2.25rem] xs:text-[2.75rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[5.5rem]">
              more than
            </span>
            <span className="block text-[2.25rem] xs:text-[2.75rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[5.5rem] text-brand-blue">
              {HERO_STATS.jobCount} Jobs
            </span>
          </h1>

          {/* Brushstroke underline */}
          <BrushstrokeUnderline className="mt-1 mb-6" />

          {/* Sub-headline */}
          <p className="text-subtitle text-sm sm:text-base lg:text-lg max-w-sm sm:max-w-md leading-relaxed mb-8 sm:mb-10">
            {HERO_STATS.subtitle}
          </p>

          {/* Search bar */}
          {/* TODO: onSearch → router.push(`/jobs?q=${keyword}&loc=${location}`) */}
          <SearchBar />

          {/* Popular tags */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
            <span className="text-sm text-subtitle font-normal">Popular :</span>
            {popularTags.map((tag, idx) => (
              <Link
                key={tag.href}
                href={tag.href}
                className="text-sm font-medium text-heading-dark hover:text-brand-indigo transition-colors duration-200 underline-offset-2 hover:underline"
                aria-label={`Browse ${tag.label} jobs`}
              >
                {tag.label}
                {idx < popularTags.length - 1 && (
                  <span className="text-subtitle ml-0.5">,</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-[44%] xl:w-[46%] overflow-hidden"
          aria-hidden="true"
        >
          {/* Decorative shape grid */}
          <HeroGeometricDecoration />

          {/* Hero person image — positioned bottom-center */}
          <div className="absolute bottom-0 inset-x-0 flex justify-center items-end h-full">
            <Image
              src="/Smiling_Person_For_Landing_Page.png"
              alt="Smiling professional pointing, representing QuickHire job seekers"
              width={880}
              height={1160}
              className="object-contain object-bottom h-[65vh] w-auto drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
