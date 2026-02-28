// Public landing page — served at route "/"
// Server Component: no client state required.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustedCompaniesSection from "@/components/home/TrustedCompaniesSection";
import ExploreCategoriesSection from "@/components/home/ExploreCategoriesSection";
import CtaSection from "@/components/home/CtaSection";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import LatestJobsSection from "@/components/home/LatestJobsSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-hero-bg flex flex-col">
      <Navbar />
      <HeroSection />
      <TrustedCompaniesSection />
      <ExploreCategoriesSection />
      <CtaSection />
      <FeaturedJobsSection />
      <LatestJobsSection />
      <Footer />
    </main>
  );
}
