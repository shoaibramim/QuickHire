// Pricing page — /pricing

import type { Metadata } from "next";
import PricingCards from "@/components/pricing/PricingCards";

export const metadata: Metadata = {
  title: "Pricing — QuickHire",
  description: "Simple, transparent pricing for employers on QuickHire.",
};

export default function PricingPage() {
  return (
    <section className="min-h-screen">
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-14 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-heading-dark mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-subtitle text-base sm:text-lg max-w-xl mx-auto">
            Start for free. Upgrade when you need more power. No hidden fees.
          </p>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingCards />
        </div>
      </div>
    </section>
  );
}
