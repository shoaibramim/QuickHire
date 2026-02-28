// Decorative geometric background for the hero section right panel.
// Renders overlapping rotated rectangles in a cascading pattern.
// Pure SVG — Server Component, zero JS.

interface GeometricDecorationProps {
  className?: string;
}

// Rectangle descriptor — each shape is drawn at a distinct offset / opacity
const RECTS = [
  { tx: 160, ty: 180, w: 280, h: 380, opacity: 0.50 },
  { tx: 200, ty: 220, w: 250, h: 340, opacity: 0.45 },
  { tx: 240, ty: 260, w: 220, h: 300, opacity: 0.38 },
  { tx: 280, ty: 300, w: 190, h: 260, opacity: 0.30 },
  { tx: 320, ty: 340, w: 160, h: 220, opacity: 0.22 },
] as const;

const ROTATION = -16; // degrees — matches Figma visual
const STROKE_COLOR = "#C5C6E8";
const STROKE_WIDTH = 1.8;

export default function GeometricDecoration({
  className = "",
}: GeometricDecorationProps) {
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
