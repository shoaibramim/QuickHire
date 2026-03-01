// Public landing page — served at route "/"
// Navbar and Footer are injected by (public)/layout.tsx

import HeroSection from "@/components/home/HeroSection";
import TrustedCompaniesSection from "@/components/home/TrustedCompaniesSection";
import ExploreCategoriesSection from "@/components/home/ExploreCategoriesSection";
import CtaSection from "@/components/home/CtaSection";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import LatestJobsSection from "@/components/home/LatestJobsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustedCompaniesSection />
      <ExploreCategoriesSection />
      <CtaSection />
      <FeaturedJobsSection />
      <LatestJobsSection />
    </>
  );
}
