export default function UjianSoalSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-56 bg-gray-100 rounded-lg" />
            <div className="flex items-center gap-4">
              <div className="h-3 w-28 bg-gray-100 rounded-lg" />
              <div className="h-3 w-36 bg-gray-100 rounded-lg" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-14 bg-gray-100 rounded" />
              <div className="h-7 w-12 bg-gray-100 rounded-lg" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-8 w-24 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi soal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <div className="h-4 w-28 bg-gray-100 rounded-lg mb-3" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-9 h-9 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Soal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-32 bg-gray-100 rounded-lg" />
          <div className="h-3 w-24 bg-gray-100 rounded-lg" />
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-3.5 w-full bg-gray-100 rounded" />
          <div className="h-3.5 w-4/5 bg-gray-100 rounded" />
          <div className="h-3.5 w-3/5 bg-gray-100 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-9 w-28 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
