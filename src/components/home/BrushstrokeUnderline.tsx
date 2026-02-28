// Decorative brushstroke-style underline rendered beneath the hero headline.
// Pure SVG — Server Component, zero JS.

interface BrushstrokeUnderlineProps {
  className?: string;
}

export default function BrushstrokeUnderline({
  className = "",
}: BrushstrokeUnderlineProps) {
  return (
    <svg
      viewBox="0 0 460 22"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-72 sm:w-96 lg:w-[420px] xl:w-[460px] ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* Primary thick stroke */}
      <path
        d="M4 12 C40 4, 90 18, 150 10 C210 2, 270 18, 330 9 C380 2, 430 15, 458 10"
        stroke="#2563EB"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Secondary thin shadow stroke for depth */}
      <path
        d="M8 16 C50 8, 105 20, 165 14 C225 8, 285 20, 345 13 C390 7, 435 17, 455 13"
        stroke="#2563EB"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
