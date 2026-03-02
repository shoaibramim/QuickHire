// Static site data — layout constants, content config & mock job data.
// TODO: Replace FEATURED_JOBS / LATEST_JOBS with real API calls when backend is ready.

import type {
  NavLink,
  HeroStats,
  TrustedCompany,
  CtaContent,
  FeaturedJob,
  LatestJob,
  FooterLinkGroup,
  FooterSocialLink,
} from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Browse Companies", href: "/companies" },
];

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

export const CTA_CONTENT: CtaContent = {
  headline: "Start posting jobs today",
  subtext: "Start posting jobs for only $10.",
  buttonLabel: "Sign Up For Free",
  buttonHref: "/register",
  dashboardImageSrc: "/Dashboard_Company_CTA.png",
  dashboardImageAlt: "QuickHire employer dashboard preview",
};

// TODO: Replace with GET /api/jobs/featured
export const FEATURED_JOBS: FeaturedJob[] = [
  {
    id: "job-1",
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    description: "Revolut is looking for Email Marketing to help team manage growth campaigns and customer retention.",
    employmentType: "Full Time",
    companyLogoKey: "revolut",
    tags: ["marketing", "design"],
    href: "/jobs/job-1",
  },
  {
    id: "job-2",
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Fransisco, US",
    description: "Dropbox is looking for Brand Designer to help the team to craft compelling visual narratives.",
    employmentType: "Full Time",
    companyLogoKey: "dropbox",
    tags: ["design", "business"],
    href: "/jobs/job-2",
  },
  {
    id: "job-3",
    title: "Email Marketing",
    company: "Pitch",
    location: "Berlin, Germany",
    description: "Pitch is looking for Customer Manager to join marketing team and drive user engagement.",
    employmentType: "Full Time",
    companyLogoKey: "pitch",
    tags: ["marketing"],
    href: "/jobs/job-3",
  },
  {
    id: "job-4",
    title: "Visual Designer",
    company: "Blinklist",
    location: "Granada, Spain",
    description: "Blinklist is looking for Visual Designer to help team design intuitive user experiences.",
    employmentType: "Full Time",
    companyLogoKey: "blinklist",
    tags: ["design"],
    href: "/jobs/job-4",
  },
  {
    id: "job-5",
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    description: "ClassPass is looking for Product Designer to help us build beautiful product interfaces.",
    employmentType: "Full Time",
    companyLogoKey: "classpass",
    tags: ["marketing", "design"],
    href: "/jobs/job-5",
  },
  {
    id: "job-6",
    title: "Lead Designer",
    company: "Canva",
    location: "Ontario, Canada",
    description: "Canva is looking for Lead Designer to help develop new design systems and component libraries.",
    employmentType: "Full Time",
    companyLogoKey: "canva",
    tags: ["design", "business"],
    href: "/jobs/job-6",
  },
  {
    id: "job-7",
    title: "Brand Strategist",
    company: "GoDaddy",
    location: "Marseille, France",
    description: "GoDaddy is looking for Brand Strategist to join the team and shape brand identity globally.",
    employmentType: "Full Time",
    companyLogoKey: "godaddy",
    tags: ["marketing"],
    href: "/jobs/job-7",
  },
  {
    id: "job-8",
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    description: "Twitter is looking for Data Analyst to help team design data pipelines and derive insights.",
    employmentType: "Full Time",
    companyLogoKey: "twitter",
    tags: ["technology"],
    href: "/jobs/job-8",
  },
  {
    id: "job-9",
    title: "UI Designer",
    company: "Figma",
    location: "San Francisco, US",
    description: "Figma is looking for a UI Designer to craft beautiful, pixel-perfect interfaces and design systems used by millions.",
    employmentType: "Full Time",
    companyLogoKey: "figma",
    tags: ["design"],
    href: "/jobs/job-9",
  },
];

// TODO: Replace with GET /api/jobs/latest
export const LATEST_JOBS: LatestJob[] = [
  { id: "latest-1", title: "Social Media Assistant", company: "Nomad",     location: "Paris, France",       employmentType: "Full Time", companyLogoKey: "nomad",     tags: ["marketing", "design"], href: "/jobs/latest-1" },
  { id: "latest-2", title: "Social Media Assistant", company: "Netlify",   location: "Paris, France",       employmentType: "Full Time", companyLogoKey: "netlify",   tags: ["marketing", "design"], href: "/jobs/latest-2" },
  { id: "latest-3", title: "Brand Designer",          company: "Dropbox",   location: "San Fransisco, USA",  employmentType: "Full Time", companyLogoKey: "dropbox",   tags: ["marketing", "design"], href: "/jobs/latest-3" },
  { id: "latest-4", title: "Brand Designer",          company: "Maze",      location: "San Fransisco, USA",  employmentType: "Full Time", companyLogoKey: "maze",      tags: ["marketing", "design"], href: "/jobs/latest-4" },
  { id: "latest-5", title: "Interactive Developer",   company: "Terraform", location: "Hamburg, Germany",    employmentType: "Full Time", companyLogoKey: "terraform", tags: ["marketing", "design"], href: "/jobs/latest-5" },
  { id: "latest-6", title: "Interactive Developer",   company: "Udacity",   location: "Hamburg, Germany",    employmentType: "Full Time", companyLogoKey: "udacity",   tags: ["marketing", "design"], href: "/jobs/latest-6" },
  { id: "latest-7", title: "HR Manager",              company: "Packer",    location: "Lucern, Switzerland", employmentType: "Full Time", companyLogoKey: "packer",    tags: ["marketing", "design"], href: "/jobs/latest-7" },
  { id: "latest-8", title: "HR Manager",              company: "Webflow",   location: "Lucern, Switzerland", employmentType: "Full Time", companyLogoKey: "webflow",   tags: ["marketing", "design"], href: "/jobs/latest-8" },
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: "About",
    links: [
      { label: "Companies",      href: "/companies" },
      { label: "Pricing",        href: "/pricing" },
      { label: "Terms",          href: "/terms" },
      { label: "Advice",         href: "/advice" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Docs",  href: "/help" },
      { label: "Guide",      href: "/guide" },
      { label: "Updates",    href: "/updates" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: "Facebook",  href: "https://facebook.com",  iconKey: "facebook" },
  { label: "Instagram", href: "https://instagram.com", iconKey: "instagram" },
  { label: "Dribbble",  href: "https://dribbble.com",  iconKey: "dribbble" },
  { label: "LinkedIn",  href: "https://linkedin.com",  iconKey: "linkedin" },
  { label: "Twitter",   href: "https://twitter.com",   iconKey: "twitter" },
];

export const FOOTER_TAGLINE =
  "Great platform for the job seeker that passionate about startups. Find your dream job easier.";

export const FOOTER_COPYRIGHT = "2021 @ QuickHire. All rights reserved.";

export const FOOTER_NEWSLETTER = {
  heading: "Get job notifications",
  subtext: "The latest job news, articles, sent to your inbox weekly.",
  inputPlaceholder: "Email Address",
  buttonLabel: "Subscribe",
};
