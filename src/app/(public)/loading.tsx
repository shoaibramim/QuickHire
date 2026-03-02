// Generic skeleton for public content pages (advice, contact, companies, etc.)
// Shown instantly by Next.js App Router while the server component loads.

function Shimmer() {
  return (
    <div
      className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"
      aria-hidden="true"
    />
  );
}

function Bone({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-gray-200 ${className ?? ""}`}>
      <Shimmer />
    </div>
  );
}

export default function PublicPageLoading() {
  return (
    <div className="bg-white min-h-screen" aria-busy="true" aria-label="Loading page">
      {/* Page header band */}
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-14">
          <Bone className="h-9 w-56 mb-3" />
          <Bone className="h-4 w-80" />
        </div>
      </div>

      {/* Body content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 space-y-4">
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-11/12" />
        <Bone className="h-4 w-5/6" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-4/5" />
        <Bone className="h-4 w-full mt-6" />
        <Bone className="h-4 w-3/4" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-11/12" />
      </div>
    </div>
  );
}
