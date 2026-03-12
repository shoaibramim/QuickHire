// Skeleton loading UI for /jobs/[id] — shown instantly while the server
// component fetches job data from the API.

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
    <div
      className={`relative overflow-hidden rounded bg-gray-200 ${className ?? ""}`}
    >
      <Shimmer />
    </div>
  );
}

export default function JobDetailLoading() {
  return (
    <div
      className="bg-white min-h-screen"
      aria-busy="true"
      aria-label="Loading job details"
    >
      {/* Breadcrumb bar */}
      <div className="bg-hero-bg border-b border-deco/40">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-4">
          <Bone className="h-4 w-48" />
        </div>
      </div>

      <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main content ─────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <Bone className="w-16 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Bone className="h-8 w-3/4" />
                <Bone className="h-4 w-1/2" />
                <div className="flex gap-2 pt-1">
                  <Bone className="h-6 w-20 rounded-sm" />
                  <Bone className="h-6 w-16 rounded-full" />
                  <Bone className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>

            {/* About the Role */}
            <div className="space-y-3">
              <Bone className="h-5 w-32 mb-4" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-11/12" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-4/5" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-3/4" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-5/6" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-2/3" />
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────── */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <Bone className="h-3 w-16" />
              <Bone className="h-5 w-32 mb-2" />

              {/* Meta rows */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Bone className="h-3 w-16" />
                    <Bone className="h-3 w-24" />
                  </div>
                ))}
              </div>

              {/* Apply form skeleton */}
              <div className="pt-2 space-y-3">
                <Bone className="h-10 w-full rounded-lg" />
                <Bone className="h-10 w-full rounded-lg" />
                <Bone className="h-10 w-full rounded-lg" />
                <Bone className="h-10 w-full rounded-lg" />
              </div>

              <Bone className="h-4 w-32 mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
