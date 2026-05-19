"use client";

// DashboardTopBar — top navigation bar of the dashboard with company selector,
// notification bell, and Post a Job CTA.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ImageCropModal from "@/components/ui/ImageCropModal";
import PostJobButton from "@/components/ui/PostJobButton";
import { apiClient } from "@/services/apiClient";
import type { User } from "@/types/auth";

export default function DashboardTopBar() {
  const { user, updateUser } = useAuth();
  const [logoPreview, setLogoPreview] = useState(user?.companyLogo ?? "");
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoSaving, setLogoSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  useEffect(() => {
    setLogoPreview(user.companyLogo ?? "");
  }, [user.companyLogo]);

  const displayName = user.company ?? user.name;
  const displayInitial = (displayName || "?")[0]?.toUpperCase();
  function handleLogoClick() {
    if (logoPreview) {
      setCropSource(logoPreview);
      setLogoError(null);
      return;
    }
    fileInputRef.current?.click();
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Please select an image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoError("Logo image must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(reader.result as string);
      setLogoError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleCropConfirm(croppedDataUrl: string) {
    setCropSource(null);
    setLogoSaving(true);
    setLogoError(null);
    try {
      const updated = await apiClient.put<User>("/auth/profile", {
        companyLogo: croppedDataUrl,
      });
      updateUser(updated);
      setLogoPreview(updated.companyLogo ?? croppedDataUrl);
    } catch (err: unknown) {
      setLogoError(
        err instanceof Error ? err.message : "Failed to update logo.",
      );
    } finally {
      setLogoSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleCropCancel() {
    setCropSource(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      {cropSource && (
        <ImageCropModal
          imageSrc={cropSource}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
          onSelectNew={openFilePicker}
          selectLabel="Upload new"
          title="Crop company logo"
          subtitle="Drag to reposition · scroll or use the slider to zoom · result will be a square."
        />
      )}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 xl:px-10 2xl:px-14 gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 mr-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Upload company logo"
          />
          <button
            type="button"
            onClick={handleLogoClick}
            disabled={logoSaving}
            className="group relative w-9 h-9 rounded-lg overflow-hidden border border-indigo-100 bg-indigo-100 flex items-center justify-center transition"
            title="Update company logo"
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt={`${displayName} logo`}
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <span className="text-brand-indigo text-xs font-bold">
                {displayInitial}
              </span>
            )}
            {!logoSaving && (
              <span
                className="absolute inset-x-0 bottom-0 h-4 bg-black/80 text-white text-[9px] font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                aria-hidden="true"
              >
                Update
              </span>
            )}
            {logoSaving && (
              <span className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span
                  className="w-4 h-4 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
              </span>
            )}
          </button>
          <div>
            <p className="text-xs text-subtitle leading-none">Company</p>
            <p className="text-sm font-semibold text-heading-dark">
              {displayName}
            </p>
            {logoError && (
              <p className="text-[11px] text-red-500 leading-tight">
                {logoError}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PostJobButton />
        </div>
      </header>
    </>
  );
}
