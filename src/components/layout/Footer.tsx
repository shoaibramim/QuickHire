import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaDribbble,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import type { IconType } from "react-icons";

import FooterBrand from "@/components/layout/FooterBrand";
import NewsletterForm from "@/components/layout/NewsletterForm";
import {
  FOOTER_LINK_GROUPS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_TAGLINE,
  FOOTER_COPYRIGHT,
} from "@/constants/siteData";
import type { SocialIconKey } from "@/types";

const SOCIAL_ICON_MAP: Record<SocialIconKey, IconType> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  dribbble: FaDribbble,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
};

export default function Footer() {
  return (
    <footer className="bg-footer-bg" aria-label="Site footer">
      {/* Main footer content */}
      <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <FooterBrand />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {FOOTER_TAGLINE}
            </p>
          </div>

          {/* Link group columns */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-white font-semibold text-base mb-5">
                {group.heading}
              </h3>
              <ul className="space-y-3" aria-label={`${group.heading} links`}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter column */}
          <div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700" />

      {/* Bottom bar */}
      <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">{FOOTER_COPYRIGHT}</p>

        <ul className="flex items-center gap-3" aria-label="Social media links">
          {FOOTER_SOCIAL_LINKS.map((social) => {
            const Icon = SOCIAL_ICON_MAP[social.iconKey];
            return (
              <li key={social.iconKey}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-brand-indigo hover:text-white transition-colors duration-200"
                >
                  <Icon className="text-sm" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
