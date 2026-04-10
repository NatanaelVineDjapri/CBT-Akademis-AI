interface Props {
  count: number;
}

export default function MataKuliahSkeleton({ count }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="flex flex-col gap-2">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="mt-auto h-8 bg-gray-200 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
