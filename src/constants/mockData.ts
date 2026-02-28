// Mock data — separated from UI for easy API migration
// TODO: Replace all exports with API responses when backend is ready

import type { NavLink, PopularTag, LocationOption, HeroStats, TrustedCompany } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Browse Companies", href: "/companies" },
];

// TODO: Replace with GET /api/jobs/popular-tags
export const POPULAR_TAGS: PopularTag[] = [
  { label: "UI Designer", href: "/jobs?q=ui-designer" },
  { label: "UX Researcher", href: "/jobs?q=ux-researcher" },
  { label: "Android", href: "/jobs?q=android" },
  { label: "Admin", href: "/jobs?q=admin" },
];

// TODO: Replace with GET /api/locations
export const LOCATION_OPTIONS: LocationOption[] = [
  { value: "florence-italy", label: "Florence, Italy" },
  { value: "new-york-usa", label: "New York, USA" },
  { value: "london-uk", label: "London, UK" },
  { value: "berlin-germany", label: "Berlin, Germany" },
  { value: "paris-france", label: "Paris, France" },
  { value: "tokyo-japan", label: "Tokyo, Japan" },
  { value: "sydney-australia", label: "Sydney, Australia" },
];

// TODO: Replace with GET /api/companies/trusted when backend is ready
export const TRUSTED_COMPANIES: TrustedCompany[] = [
  {
    name: "Vodafone",
    logoSrc: "/vodafone-2017-logo.png",
    logoWidth: 130,
    logoHeight: 40,
  },
  {
    name: "Intel",
    logoSrc: "/intel-3.png",
    logoWidth: 80,
    logoHeight: 40,
  },
  {
    name: "Tesla",
    logoSrc: "/tesla-9.png",
    logoWidth: 120,
    logoHeight: 40,
  },
  {
    name: "AMD",
    logoSrc: "/amd-logo-1.png",
    logoWidth: 100,
    logoHeight: 40,
  },
  {
    name: "Talkit",
    logoSrc: "/talkit_1.png",
    logoWidth: 100,
    logoHeight: 40,
  },
];

export const HERO_STATS: HeroStats = {
  jobCount: "5000+",
  tagline: "Discover more than",
  subtitle:
    "Great platform for the job seeker that searching for new career heights and passionate about startups.",
};
