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
