interface GeometricDecorationProps {
  className?: string;
}

const RECTS = [
  { tx: 160, ty: 280, w: 200, h: 266, opacity: 0.50 },
  { tx: 200, ty: 320, w: 200, h: 266, opacity: 0.44 },
  { tx: 240, ty: 360, w: 200, h: 266, opacity: 0.38 },
  { tx: 280, ty: 400, w: 200, h: 266, opacity: 0.32 },
  { tx: 320, ty: 440, w: 200, h: 266, opacity: 0.26 },
] as const;

const ROTATION = -16;
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
