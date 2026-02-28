import Image from "next/image";
import Link from "next/link";

// ─── Props ────────────────────────────────────────────────────

interface LogoProps {
  /** Icon diameter in px */
  iconSize?: number;
  /** Hide the brand text (icon-only mode) */
  iconOnly?: boolean;
  /** Invert colours for dark backgrounds */
  inverted?: boolean;
  /** Render brand text in white without affecting the icon */
  lightText?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────

export default function Logo({
  iconSize = 36,
  iconOnly = false,
  inverted = false,
  lightText = false,
  className = "",
}: LogoProps) {
  const useWhiteText = inverted || lightText;

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 group select-none ${className}`}
      aria-label="QuickHire — go to homepage"
    >
      <Image
        src="/QuickHire_Logo.png"
        alt="QuickHire logo mark"
        width={iconSize}
        height={iconSize}
        className={`shrink-0 ${inverted ? "brightness-0 invert" : ""}`}
        priority
      />
      {!iconOnly && (
        <span
          className={`font-bold text-xl tracking-tight transition-colors duration-200 ${
            useWhiteText
              ? "text-white group-hover:text-indigo-300"
              : "text-heading-dark group-hover:text-brand-indigo"
          }`}
        >
          QuickHire
        </span>
      )}
    </Link>
  );
}
