// LinkButton — renders an anchor (<Link>) styled identically to <Button>.
// Use whenever a "button" should navigate rather than trigger a JS handler.

import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "outline-white" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-indigo text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-brand-indigo",
  outline:
    "border border-brand-indigo text-brand-indigo bg-transparent hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-brand-indigo",
  "outline-white":
    "border border-white text-white bg-transparent hover:bg-white hover:text-brand-indigo active:bg-indigo-50 focus-visible:ring-white",
  ghost:
    "text-brand-indigo bg-transparent hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-brand-indigo",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  "aria-label"?: string;
}

export default function LinkButton({
  href,
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  "aria-label": ariaLabel,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center font-semibold rounded-lg",
        "transition-colors duration-200 cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Link>
  );
}
