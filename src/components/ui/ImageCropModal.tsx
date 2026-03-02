"use client";

/**
 * ImageCropModal — interactive square-crop editor for company logo uploads.
 *
 * • Drag the image to reposition.
 * • Use the zoom slider (or mouse wheel) to zoom in / out.
 * • The image always fills the square canvas — no empty corners.
 * • Click "Crop & Use" to receive a JPEG data URL of the cropped square.
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  /** Raw data-URL of the image chosen by the user. */
  imageSrc: string;
  /** Called with the cropped square JPEG data-URL when the user confirms. */
  onConfirm: (croppedDataUrl: string) => void;
  /** Called when the user cancels — file selection should be reset. */
  onCancel: () => void;
}

const PREVIEW_PX = 320; // visible canvas size (CSS pixels)

export default function ImageCropModal({ imageSrc, onConfirm, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);

  // scale: how many canvas-px per image-px
  const [scale,    setScale]   = useState(1);
  const [minScale, setMinScale] = useState(1);

  // offset: top-left corner of the scaled image relative to canvas origin
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drag state stored in a ref to avoid stale closures in mousemove
  const drag = useRef<{ active: boolean; startX: number; startY: number; ox: number; oy: number }>({
    active: false, startX: 0, startY: 0, ox: 0, oy: 0,
  });

  // ── Clamp offset so the image always covers the full canvas ──────────────
  const clamp = useCallback(
    (s: number, ox: number, oy: number) => {
      const img = imgRef.current;
      if (!img) return { x: ox, y: oy };
      const scaledW = img.naturalWidth  * s;
      const scaledH = img.naturalHeight * s;
      return {
        x: Math.min(0, Math.max(ox, PREVIEW_PX - scaledW)),
        y: Math.min(0, Math.max(oy, PREVIEW_PX - scaledH)),
      };
    },
    []
  );

  // ── Draw canvas ───────────────────────────────────────────────────────────
  const draw = useCallback((s: number, ox: number, oy: number) => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, PREVIEW_PX, PREVIEW_PX);
    ctx.drawImage(img, ox, oy, img.naturalWidth * s, img.naturalHeight * s);
  }, []);

  // ── Load image on mount / imageSrc change ────────────────────────────────
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;

      // Scale so the shorter edge fills the canvas (image always covers the square)
      const ms = Math.max(
        PREVIEW_PX / img.naturalWidth,
        PREVIEW_PX / img.naturalHeight
      );
      const initOffset = {
        x: (PREVIEW_PX - img.naturalWidth  * ms) / 2,
        y: (PREVIEW_PX - img.naturalHeight * ms) / 2,
      };

      setMinScale(ms);
      setScale(ms);
      setOffset(initOffset);
      draw(ms, initOffset.x, initOffset.y);
    };
    img.src = imageSrc;
  }, [imageSrc, draw]);

  // ── Redraw whenever scale / offset change ────────────────────────────────
  useEffect(() => {
    draw(scale, offset.x, offset.y);
  }, [scale, offset, draw]);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drag.current.active) return;
    const newOff = clamp(scale,
      drag.current.ox + (e.clientX - drag.current.startX),
      drag.current.oy + (e.clientY - drag.current.startY),
    );
    setOffset(newOff);
  }

  function onPointerUp() {
    drag.current.active = false;
  }

  // ── Wheel zoom ────────────────────────────────────────────────────────────
  function onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const factor    = e.deltaY < 0 ? 1.08 : 1 / 1.08;
    const newScale  = Math.max(minScale, Math.min(scale * factor, minScale * 6));
    // Zoom towards canvas center
    const cx = PREVIEW_PX / 2, cy = PREVIEW_PX / 2;
    const newOff = clamp(newScale,
      cx - (cx - offset.x) * (newScale / scale),
      cy - (cy - offset.y) * (newScale / scale),
    );
    setScale(newScale);
    setOffset(newOff);
  }

  // ── Slider zoom ───────────────────────────────────────────────────────────
  function onSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newScale = Number(e.target.value);
    const cx = PREVIEW_PX / 2, cy = PREVIEW_PX / 2;
    const newOff = clamp(newScale,
      cx - (cx - offset.x) * (newScale / scale),
      cy - (cy - offset.y) * (newScale / scale),
    );
    setScale(newScale);
    setOffset(newOff);
  }

  // ── Confirm: export a 400×400 JPEG compressed to ≤ 500 KB ───────────────
  function handleConfirm() {
    const img = imgRef.current;
    if (!img) return;

    const OUTPUT = 400;
    const ratio  = OUTPUT / PREVIEW_PX;

    const out = document.createElement("canvas");
    out.width  = OUTPUT;
    out.height = OUTPUT;
    const ctx = out.getContext("2d")!;
    ctx.drawImage(
      img,
      offset.x * ratio,
      offset.y * ratio,
      img.naturalWidth  * scale * ratio,
      img.naturalHeight * scale * ratio,
    );

    // Progressively lower quality until the data URL is ≤ 500 KB.
    // Each base64 char ≈ 0.75 bytes, so 500 KB raw ≈ 666 KB of base64 chars.
    const MAX_BYTES = 500 * 1024;
    let quality = 0.92;
    let dataUrl  = out.toDataURL("image/jpeg", quality);

    while (dataUrl.length * 0.75 > MAX_BYTES && quality > 0.10) {
      quality  = Math.round((quality - 0.08) * 100) / 100;
      dataUrl  = out.toDataURL("image/jpeg", quality);
    }

    onConfirm(dataUrl);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Crop company logo"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-5 p-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-heading-dark">Crop Company Logo</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-subtitle hover:text-heading-dark transition-colors"
            aria-label="Close crop modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Instruction */}
        <p className="text-xs text-subtitle -mt-2">
          Drag to reposition · scroll or use the slider to zoom · result will be a square.
        </p>

        {/* Canvas crop area */}
        <div
          className="mx-auto rounded-xl overflow-hidden ring-2 ring-brand-indigo/40 shadow-inner"
          style={{ width: PREVIEW_PX, height: PREVIEW_PX }}
        >
          <canvas
            ref={canvasRef}
            width={PREVIEW_PX}
            height={PREVIEW_PX}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onWheel={onWheel}
            className="cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ display: "block" }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3">
          {/* Zoom-out icon */}
          <svg className="w-4 h-4 text-subtitle flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zM8 11h6" />
          </svg>
          <input
            type="range"
            min={minScale}
            max={minScale * 6}
            step={minScale * 0.02}
            value={scale}
            onChange={onSliderChange}
            className="flex-1 accent-brand-indigo h-1.5 rounded-full"
            aria-label="Zoom level"
          />
          {/* Zoom-in icon */}
          <svg className="w-4 h-4 text-subtitle flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zM11 8v6M8 11h6" />
          </svg>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-heading-dark hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-indigo text-white text-sm font-semibold hover:bg-brand-indigo/90 transition-colors"
          >
            Crop &amp; Use
          </button>
        </div>

      </div>
    </div>
  );
}
