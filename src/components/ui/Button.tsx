import type { ButtonHTMLAttributes, ReactNode } from "react";

// ─── Variant & Size maps ───────────────────────────────────────

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

// ─── Props ────────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
}

// ─── Component ────────────────────────────────────────────────

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center font-semibold rounded-lg",
        "transition-colors duration-200 cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
