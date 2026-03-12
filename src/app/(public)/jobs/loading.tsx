// Skeleton loading UI for /jobs — shown instantly by Next.js App Router
// while the server component fetches data from the API.

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

// ── Job card skeleton ──────────────────────────────────────────
function JobCardSkeleton() {
  return (
    <div className="flex flex-col h-full p-6 bg-white border border-gray-200 rounded-xl">
      {/* Logo + badge row */}
      <div className="flex items-start justify-between mb-5">
        <Bone className="w-12 h-12 rounded-lg" />
        <Bone className="w-20 h-6 rounded-sm" />
      </div>
      {/* Title */}
      <Bone className="h-4 w-3/4 mb-2" />
      {/* Company · location */}
      <Bone className="h-3 w-1/2 mb-4" />
      {/* Description lines */}
      <Bone className="h-3 w-full mb-2" />
      <Bone className="h-3 w-5/6 mb-5" />
      {/* Tags */}
      <div className="flex gap-2 mt-auto">
        <Bone className="h-6 w-14 rounded-full" />
        <Bone className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

// ── Filter bar skeleton ────────────────────────────────────────
function FilterBarSkeleton() {
  return (
    <div
      className="flex flex-wrap items-center gap-3 py-3"
      aria-label="Loading filters"
    >
      {/* Search input */}
      <Bone className="h-10 w-48 rounded-lg" />
      {/* Category */}
      <Bone className="h-10 w-36 rounded-lg" />
      {/* Type */}
      <Bone className="h-10 w-28 rounded-lg" />
      {/* Location */}
      <Bone className="h-10 w-40 rounded-lg" />
      {/* View toggle */}
      <Bone className="h-10 w-20 rounded-lg ml-auto" />
    </div>
  );
}

// ── Page skeleton ──────────────────────────────────────────────
export default function JobsLoading() {
  return (
    <section className="bg-white min-h-screen" aria-busy="true" aria-label="Loading jobs">

      {/* Page header */}
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-14">
          <Bone className="h-8 w-48 mb-3" />
          <Bone className="h-4 w-32" />
        </div>
      </div>

      <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
        {/* Filter bar */}
        <FilterBarSkeleton />

        {/* Job grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
