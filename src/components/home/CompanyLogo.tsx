import {
  FaDropbox,
  FaTwitter,
  FaLink,
  FaTint,
  FaCircle,
  FaCompass,
  FaBolt,
  FaHeadphones,
  FaCubes,
  FaGraduationCap,
  FaBox,
  FaCode,
} from "react-icons/fa";
import type { IconType } from "react-icons";

type CompanyLogoConfig = {
  bgClass: string;
  initial?: string;
  initialTextClass?: string;
  faIcon?: IconType;
  iconClass?: string;
};

const COMPANY_LOGO_CONFIG: Record<string, CompanyLogoConfig> = {
  // Featured Jobs companies
  revolut:   { bgClass: "bg-black",                           initial: "R",  initialTextClass: "text-white font-bold text-lg" },
  dropbox:   { bgClass: "bg-white border border-gray-200",    faIcon: FaDropbox,       iconClass: "text-blue-500 text-2xl" },
  pitch:     { bgClass: "bg-black",                           initial: "P",  initialTextClass: "text-white font-bold text-lg" },
  blinklist: { bgClass: "bg-white border border-gray-200",    faIcon: FaTint,          iconClass: "text-teal-500 text-2xl" },
  classpass: { bgClass: "bg-white border border-gray-200",    faIcon: FaLink,          iconClass: "text-blue-500 text-2xl" },
  canva:     { bgClass: "bg-teal-500",                        initial: "C",  initialTextClass: "text-white font-bold text-lg" },
  godaddy:   { bgClass: "bg-black",                           faIcon: FaCircle,        iconClass: "text-white text-xl" },
  twitter:   { bgClass: "bg-sky-500",                         faIcon: FaTwitter,       iconClass: "text-white text-2xl" },

  // Latest Jobs companies
  nomad:     { bgClass: "bg-emerald-600",                     faIcon: FaCompass,       iconClass: "text-white text-2xl" },
  netlify:   { bgClass: "bg-teal-400",                        faIcon: FaBolt,          iconClass: "text-white text-2xl" },
  maze:      { bgClass: "bg-blue-600",                        faIcon: FaHeadphones,    iconClass: "text-white text-xl" },
  terraform: { bgClass: "bg-violet-500",                      faIcon: FaCubes,         iconClass: "text-white text-xl" },
  udacity:   { bgClass: "bg-cyan-500",                        faIcon: FaGraduationCap, iconClass: "text-white text-xl" },
  packer:    { bgClass: "bg-orange-500",                      faIcon: FaBox,           iconClass: "text-white text-xl" },
  webflow:   { bgClass: "bg-indigo-600",                      faIcon: FaCode,          iconClass: "text-white text-xl" },
};

const FALLBACK_LOGO_CONFIG: CompanyLogoConfig = {
  bgClass: "bg-gray-200",
  initial: "?",
  initialTextClass: "text-gray-600 font-bold text-lg",
};

interface CompanyLogoProps {
  companyLogoKey: string;
  sizeClass?: string;
}

export default function CompanyLogo({
  companyLogoKey,
  sizeClass = "w-12 h-12",
}: CompanyLogoProps) {
  const config = COMPANY_LOGO_CONFIG[companyLogoKey] ?? FALLBACK_LOGO_CONFIG;
  const Icon = config.faIcon;

  return (
    <div
      className={`${sizeClass} rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgClass}`}
      aria-hidden="true"
    >
      {Icon
        ? <Icon className={config.iconClass} />
        : <span className={config.initialTextClass}>{config.initial}</span>
      }
    </div>
  );
}
