interface Props {
  count: number;
}

export default function UjianCardSkeleton({ count }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
          </div>
          <div className="border-t border-gray-100" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-2/3 rounded bg-gray-100" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3">
            <div className="h-3 w-1/3 rounded bg-gray-100" />
            <div className="h-3 w-1/4 rounded bg-gray-100" />
          </div>
          <div className="border-t border-gray-100" />
          <div className="rounded-xl p-3 bg-gray-100 flex flex-col items-center gap-2">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-8 w-24 rounded bg-gray-200" />
          </div>
          <div className="h-8 w-full rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
