import Image from "next/image";

import CtaAuthButton from "@/components/home/CtaAuthButton";
import { CTA_CONTENT } from "@/constants/mockData";

// Two mirrored trapezoids that together form a left-pointing chevron ( < ) on the card edge.
const TOP_CHEVRON_CLIP = "polygon(0 0, 100% 0, 50% 100%, 0 100%)";
const BOTTOM_CHEVRON_CLIP = "polygon(0 0, 50% 0, 100% 100%, 0 100%)";

export default function CtaSection() {
  return (
    <section className="bg-white pt-4 pb-10 sm:pb-16" aria-label="Start posting jobs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">

        {/*
          Outer wrapper is the positioning context for the dashboard image.
          The card sits mt-16 below, leaving 64 px of headroom for the image
          to visually overflow above the card's top edge.
        */}
        <div className="relative">

          {/* Indigo card */}
          <div
            className="relative bg-brand-indigo rounded-tr-xl rounded-bl-xl overflow-hidden mt-8 sm:mt-12 lg:mt-16 min-h-[300px] sm:min-h-[360px] md:min-h-[400px] flex items-center"
          >
            {/* Top-left cut-corner triangle overlay */}
            <div
              className="absolute top-0 left-0 z-20 w-0 h-0"
              style={{ borderTop: "80px solid white", borderRight: "80px solid transparent" }}
              aria-hidden="true"
            />
            {/* Bottom-right cut-corner triangle overlay */}
            <div
              className="absolute bottom-0 right-0 z-20 w-0 h-0"
              style={{ borderBottom: "80px solid white", borderLeft: "80px solid transparent" }}
              aria-hidden="true"
            />

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
            <div className="relative z-10 pl-16 sm:pl-20 md:pl-24 pr-6 sm:pr-8 py-10 md:py-14 w-full lg:w-[45%]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
                {CTA_CONTENT.headline}
              </h2>
              <p className="text-indigo-200 text-sm sm:text-base mb-6 sm:mb-8">
                {CTA_CONTENT.subtext}
              </p>
              <CtaAuthButton label={CTA_CONTENT.buttonLabel} />
            </div>

          </div>

          {/*
            Dashboard screenshot — sibling of the card, not a child, so the card's
            overflow-hidden does not clip it. Anchored to top-0 of the outer wrapper,
            which is 64 px above the card, making the image overflow upward.
          */}
          <div
            className="hidden lg:block absolute top-8 right-8 w-[56%] pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src={CTA_CONTENT.dashboardImageSrc}
              alt={CTA_CONTENT.dashboardImageAlt}
              width={880}
              height={520}
              className="w-full h-auto object-contain drop-shadow-xl rounded-xl"
              draggable={false}
              priority={false}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
