// Decorative geometric background specifically for the Hero section right panel.
// Renders overlapping rotated rectangles in a cascading pattern.
// Pure SVG — Server Component, zero JS.

interface HeroGeometricDecorationProps {
  className?: string;
}

// Arithmetic progression:
// tx/ty : base=(160,280), step=+40  — constant offset ty = tx + 120
// w/h   : fixed 280×380
// opacity: base=0.50, step=−0.06  → 0.50, 0.44, 0.38, 0.32, 0.26
const RECTS = [
  { tx: 160, ty: 280, w: 280, h: 380, opacity: 0.50 },
  { tx: 200, ty: 320, w: 280, h: 380, opacity: 0.44 },
  { tx: 240, ty: 360, w: 280, h: 380, opacity: 0.38 },
  { tx: 280, ty: 400, w: 280, h: 380, opacity: 0.32 },
  { tx: 320, ty: 440, w: 280, h: 380, opacity: 0.26 },
] as const;

const ROTATION = -16;
const STROKE_COLOR = "#C5C6E8";
const STROKE_WIDTH = 1.8;

export default function HeroGeometricDecoration({
  className = "",
}: HeroGeometricDecorationProps) {
  return (
    <svg
      viewBox="0 0 600 700"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {RECTS.map(({ tx, ty, w, h, opacity }, i) => (
        <rect
          key={i}
          x={tx - w / 2}
          y={ty - h / 2}
          width={w}
          height={h}
          rx={6}
          fill="none"
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
          opacity={opacity}
          transform={`rotate(${ROTATION} ${tx} ${ty})`}
        />
      ))}
    </svg>
  );
}
