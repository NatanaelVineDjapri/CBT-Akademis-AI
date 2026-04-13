export default function NilaiDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* BadgeNilai skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-56 bg-gray-100 rounded-lg" />
            <div className="h-3.5 w-28 bg-gray-100 rounded-lg" />
            <div className="h-3.5 w-24 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-9 w-24 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-5 gap-2 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Tabel jawaban skeleton */}
      {[1, 2].map((t) => (
        <div key={t} className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-40 bg-gray-100 rounded-lg" />
            <div className="h-8 w-32 bg-gray-100 rounded-lg" />
          </div>
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 flex gap-4">
              {[10, 48, 20, 20, 16].map((w, i) => (
                <div key={i} className={`h-3 bg-gray-200 rounded w-${w}`} />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-3 py-3 border-t border-gray-50">
                <div className="h-3 w-6 bg-gray-100 rounded" />
                <div className="h-3 flex-1 bg-gray-100 rounded" />
                <div className="h-3 w-10 bg-gray-100 rounded" />
                <div className="h-3 w-10 bg-gray-100 rounded" />
                <div className="h-6 w-14 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
