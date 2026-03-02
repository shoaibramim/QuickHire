// Shared TypeScript types for QuickHire

export interface NavLink {
  label: string;
  href: string;
}

export interface PopularTag {
  label: string;
  href: string;
}

export interface LocationOption {
  value: string;
  label: string;
}

export interface SearchFormState {
  keyword: string;
  location: string;
}

export interface HeroStats {
  jobCount: string;
  tagline: string;
  subtitle: string;
}

export interface TrustedCompany {
  name: string;
  logoSrc: string;
  /** Intended display width (px) — keeps logos visually balanced */
  logoWidth: number;
  logoHeight: number;
}

export type CategoryIconKey =
  | "design"
  | "sales"
  | "marketing"
  | "finance"
  | "technology"
  | "engineering"
  | "business"
  | "human-resource";

export interface JobCategory {
  id: string;
  label: string;
  jobCount: number;
  href: string;
  iconKey: CategoryIconKey;
}

export interface CtaContent {
  headline: string;
  subtext: string;
  buttonLabel: string;
  buttonHref: string;
  dashboardImageSrc: string;
  dashboardImageAlt: string;
}

export type JobTagKey =
  | "marketing"
  | "design"
  | "business"
  | "technology"
  | "engineering"
  | "finance"
  | "sales"
  | "human-resource";

export type EmploymentType = "Full Time" | "Part Time" | "Contract" | "Internship" | "Remote";

export interface BaseJob {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  companyLogoKey: string;
  tags: JobTagKey[];
  href: string;
  featured?: boolean;
}

export interface FeaturedJob extends BaseJob {
  description: string;
}

export type LatestJob = BaseJob;

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export type SocialIconKey = "facebook" | "instagram" | "dribbble" | "linkedin" | "twitter";

export interface FooterSocialLink {
  label: string;
  href: string;
  iconKey: SocialIconKey;
}
