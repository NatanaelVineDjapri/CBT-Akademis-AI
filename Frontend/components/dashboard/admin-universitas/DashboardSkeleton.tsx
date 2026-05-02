export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-20" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
      </div>
    </div>
  );
}
