export default function BerandaDosenSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      {/* Baris 1: Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-36 rounded bg-gray-200" />
              <div className="h-6 w-16 rounded-lg bg-gray-100" />
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3.5 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Baris 2: Performa Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="h-4 w-40 rounded bg-gray-200 mb-4" />
        <div className="h-52 rounded-xl bg-gray-100" />
      </div>

      {/* Baris 3: 2 card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-4 w-44 rounded bg-gray-200 mb-4" />
            <div className="h-36 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Baris 4: 2 card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-4 w-44 rounded bg-gray-200 mb-4" />
            <div className="h-36 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Baris 5: Jadwal + Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="h-4 w-32 rounded bg-gray-200 mb-3" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-3 rounded bg-gray-100" style={{ width: `${75 - j * 10}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
