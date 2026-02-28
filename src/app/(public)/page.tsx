// Public landing page — served at route "/"
// Server Component: no client state required.

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TrustedCompaniesSection from "@/components/home/TrustedCompaniesSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-hero-bg flex flex-col">
      <Navbar />
      <HeroSection />
      <TrustedCompaniesSection />
    </main>
  );
}
