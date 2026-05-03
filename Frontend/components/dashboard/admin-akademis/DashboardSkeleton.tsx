export default function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 animate-pulse">
            <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1">
              <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
              <div className="h-5 bg-gray-100 rounded w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-48 mb-5" />
            <div className="h-[200px] bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    </>
  );
}
