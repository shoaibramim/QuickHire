"use client";

/**
 * FooterBrand — client wrapper so the footer logo link can
 * scroll to the very top of the home page on click, even when
 * the user is already on "/".
 */

import Logo from "@/components/ui/Logo";

export default function FooterBrand() {
  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Logo lightText className="mb-5" />
    </div>
  );
}
