"use client";

// NavigationProgress — renders a thin indigo progress bar at the top of the
// viewport whenever the user navigates to a new route. Provides instant visual
// feedback that the click was registered, complementing the per-route
// loading.tsx skeletons.

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const prevPathRef = useRef(pathname);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Walk up looking for an <a> tag
      let el = e.target as HTMLElement | null;
      while (el && el.tagName !== "A") el = el.parentElement;
      if (!el) return;

      const href = (el as HTMLAnchorElement).getAttribute("href");
      if (!href) return;

      // Ignore external links, anchors, query-only changes, and same path
      if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#"))
        return;

      // Resolve to pathname only (strip query & hash for comparison)
      const targetPath = href.split(/[?#]/)[0];
      if (targetPath === window.location.pathname || targetPath === "") return;

      // Start the bar
      startBar();
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      completeBar();
    }
  }, [pathname]);

  function startBar() {
    // Clear any in-progress animation
    if (tickRef.current) clearInterval(tickRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);

    setWidth(0);
    setVisible(true);

    // Advance quickly to ~30%, then slow down approaching 85%
    let current = 0;
    tickRef.current = setInterval(() => {
      current += current < 30 ? 10 : current < 60 ? 5 : current < 80 ? 2 : 0.5;
      if (current >= 85) {
        current = 85;
        if (tickRef.current) clearInterval(tickRef.current);
      }
      setWidth(current);
    }, 80);
  }

  function completeBar() {
    if (tickRef.current) clearInterval(tickRef.current);

    setWidth(100);

    completeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 400); // keep visible briefly so the fill is seen
  }

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    },
    []
  );

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-brand-indigo transition-[width] duration-150 ease-out"
        style={{ width: `${width}%` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(width)}
        aria-label="Page loading"
      />
    </div>
  );
}
