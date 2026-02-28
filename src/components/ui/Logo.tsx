import Image from "next/image";
import Link from "next/link";

// ─── Props ────────────────────────────────────────────────────

interface LogoProps {
  /** Icon diameter in px */
  iconSize?: number;
  /** Hide the brand text (icon-only mode) */
  iconOnly?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────

export default function Logo({
  iconSize = 36,
  iconOnly = false,
  className = "",
}: LogoProps) {
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
        className="shrink-0"
        priority
      />
      {!iconOnly && (
        <span className="text-heading-dark font-bold text-xl tracking-tight group-hover:text-brand-indigo transition-colors duration-200">
          QuickHire
        </span>
      )}
    </Link>
  );
}
