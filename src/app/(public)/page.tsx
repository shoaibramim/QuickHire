// Public landing page — served at route "/"
// Server Component: fetches live data from the Express API.

import HeroSection from "@/components/home/HeroSection";
import TrustedCompaniesSection from "@/components/home/TrustedCompaniesSection";
import ExploreCategoriesSection from "@/components/home/ExploreCategoriesSection";
import CtaSection from "@/components/home/CtaSection";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import LatestJobsSection from "@/components/home/LatestJobsSection";
import {
  getFeaturedJobs,
  getLatestJobs,
  getJobCategories,
  getPopularTags,
  getJobsCount,
} from "@/services/jobsService";

export default async function HomePage() {
  const [featuredJobs, latestJobs, categories, popularTags, totalJobs] =
    await Promise.all([
      getFeaturedJobs(),
      getLatestJobs(),
      getJobCategories(),
      getPopularTags(),
      getJobsCount(),
    ]);

  return (
    <>
      <HeroSection popularTags={popularTags} jobCount={totalJobs} />
      <TrustedCompaniesSection />
      <ExploreCategoriesSection categories={categories} />
      <CtaSection />
      <FeaturedJobsSection jobs={featuredJobs} />
      <LatestJobsSection jobs={latestJobs} />
    </>
  );
}
