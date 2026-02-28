import Image from "next/image";

import LinkButton from "@/components/ui/LinkButton";
import { CTA_CONTENT } from "@/constants/mockData";

// Two mirrored trapezoids that together form a left-pointing chevron ( < ) on the card edge.
const TOP_CHEVRON_CLIP = "polygon(0 0, 100% 0, 50% 100%, 0 100%)";
const BOTTOM_CHEVRON_CLIP = "polygon(0 0, 50% 0, 100% 100%, 0 100%)";

export default function CtaSection() {
  return (
    <section className="bg-white pt-4 pb-16" aria-label="Start posting jobs">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/*
          Outer wrapper is the positioning context for the dashboard image.
          The card sits mt-16 below, leaving 64 px of headroom for the image
          to visually overflow above the card's top edge.
        */}
        <div className="relative">

          {/* Indigo card */}
          <div className="relative bg-brand-indigo rounded-xl overflow-hidden mt-16 min-h-[300px] flex items-center">

            {/* Left chevron decoration */}
            <div className="absolute left-0 inset-y-0 w-20 pointer-events-none" aria-hidden="true">
              <div
                className="h-1/2 bg-indigo-950 opacity-40"
                style={{ clipPath: TOP_CHEVRON_CLIP }}
              />
              <div
                className="h-1/2 bg-indigo-950 opacity-40"
                style={{ clipPath: BOTTOM_CHEVRON_CLIP }}
              />
            </div>

            {/* Text content */}
            <div className="relative z-10 pl-24 pr-8 py-14 w-full lg:w-[45%]">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                {CTA_CONTENT.headline}
              </h2>
              <p className="text-indigo-200 text-base mb-8">
                {CTA_CONTENT.subtext}
              </p>
              <LinkButton
                href={CTA_CONTENT.buttonHref}
                variant="outline-white"
                size="md"
              >
                {CTA_CONTENT.buttonLabel}
              </LinkButton>
            </div>

          </div>

          {/*
            Dashboard screenshot — sibling of the card, not a child, so the card's
            overflow-hidden does not clip it. Anchored to top-0 of the outer wrapper,
            which is 64 px above the card, making the image overflow upward.
          */}
          <div
            className="hidden lg:block absolute top-0 right-0 w-[57%] pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src={CTA_CONTENT.dashboardImageSrc}
              alt={CTA_CONTENT.dashboardImageAlt}
              width={880}
              height={520}
              className="w-full h-auto object-contain drop-shadow-xl"
              draggable={false}
              priority={false}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
