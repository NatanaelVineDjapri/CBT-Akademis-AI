interface Props {
  count: number;
}

export default function UjianCardSkeleton({ count }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 flex flex-col gap-2 animate-pulse">
          {/* Icon + nama side by side */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="h-3.5 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Tanggal & waktu satu baris */}
          <div className="flex gap-3">
            <div className="h-3 w-1/2 rounded bg-gray-100" />
            <div className="h-3 w-1/3 rounded bg-gray-100" />
          </div>

          {/* Durasi & soal */}
          <div className="flex justify-between border-t border-gray-100 pt-1">
            <div className="h-3 w-1/3 rounded bg-gray-100" />
            <div className="h-3 w-1/4 rounded bg-gray-100" />
          </div>

          <div className="border-t border-gray-100" />

          {/* Nilai block */}
          <div className="rounded-xl p-3 bg-gray-100 flex flex-col items-center gap-1.5">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-6 w-20 rounded bg-gray-200" />
          </div>

          {/* Button */}
          <div className="h-8 w-full rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
